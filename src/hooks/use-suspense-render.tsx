/* eslint-disable no-restricted-syntax */
import { useState, useCallback, useContext, useLayoutEffect, useMemo } from "react";
import EventEmitter from "eventemitter3";
import {
  TaskStatus,
  type SuspenseRender,
  type ReturnValues,
  type TaskRunner,
  TaskState,
  Options,
} from "./use-suspense-render.interface";
import { SuspenseRenderContext } from "../providers";
import type { ISuspenseRenderProvider } from "../providers";

const globalStore: Record<string, TaskState<any, any> & { prevData?: any }> = {};
const emitter = new EventEmitter<string, TaskState<any, any>>();

const useSuspenseRender = <Data extends any = any, TaskError = Error | unknown>(
  options: Options<Data> = {},
  id: string | undefined = undefined,
): ReturnValues<Data, TaskError> => {
  const defaultData = useMemo(() => {
    if (id !== undefined) {
      if (id in globalStore) {
        return globalStore[id].data;
      }
      if ("defaultData" in options) {
        return options.defaultData;
      }
    }
    return undefined;
  }, [id, options]);
  const [taskState, setTaskState] = useState<TaskState<Data, TaskError>>({
    status: defaultData || "defaultData" in options ? TaskStatus.RESOLVED : TaskStatus.PENDING,
  });

  const context = useContext<ISuspenseRenderProvider.Context>(SuspenseRenderContext);

  useLayoutEffect(() => {
    /**
     * Subscribe to global store
     */
    if (id) {
      /**
       * Setting as initial data when there is data in global store
       */
      if (id in globalStore) {
        setTaskState(globalStore[id]);
      }
      const handleDataEmit = () => {
        setTaskState(globalStore[id]);
      };
      emitter.on(id, handleDataEmit);
      return () => {
        emitter.off(id, handleDataEmit);
      };
    }
    return () => {};
  }, [id]);

  /**
   * Update task status and global store
   */
  const updateStatus = useCallback((data: TaskState<Data, TaskError>, sharedId?: string) => {
    /**
     * Update local status
     */
    setTaskState((prev) => {
      const state = {
        ...data,
        prevData: data.status === TaskStatus.RESOLVED ? prev.prevData : prev.data,
      };
      if (sharedId) {
        /**
         * Update global store
         */
        globalStore[sharedId] = state;
        emitter.emit(sharedId, state);
      }
      return state;
    });
  }, []);

  /**
   * Run `task` function
   */
  const taskRunner: TaskRunner<Data> = useCallback(
    async (task, taskId?: string) => {
      try {
        const taskRunnerInterceptors = context.experimentals?.taskRunnerInterceptors;
        if (taskRunnerInterceptors) {
          let promise;
          for (const taskRunnerInterceptor of taskRunnerInterceptors) {
            // eslint-disable-next-line no-await-in-loop
            promise = taskRunnerInterceptor(await promise, task, taskId);
            updateStatus({ status: TaskStatus.PENDING, promise }, id);
          }
          const data = await promise;
          updateStatus({ status: TaskStatus.RESOLVED, data }, id);
          return data;
        }
        const promise = task();
        updateStatus({ status: TaskStatus.PENDING, promise }, id);
        const data = await promise;
        updateStatus({ status: TaskStatus.RESOLVED, data }, id);
        return data;
      } catch (e) {
        const error = e as TaskError;
        updateStatus({ status: TaskStatus.REJECTED, error }, id);
        throw e;
      }
    },
    [context.experimentals?.taskRunnerInterceptors, id, updateStatus],
  );

  /**
   * Render component
   */
  const suspenseRender: SuspenseRender<Data, TaskError> = useCallback(
    (renderSuccess, renderLoading, renderError) => {
      const { data, prevData, status, error, promise } = taskState;
      switch (status) {
        case TaskStatus.RESOLVED: {
          const render = (renderSuccess ?? context.renderSuccess) || null;
          return typeof render === "function"
            ? render((data ?? options.defaultData) as Data, prevData)
            : render;
        }
        case TaskStatus.REJECTED: {
          const render = (renderError ?? context.renderError) || null;
          if (typeof render === undefined) {
            /**
             * Propagate the error upwards if the error component does not exist,
             * so that it can be handled at the error boundary.
             */
            if (error instanceof Error) {
              throw error;
            }
          }
          if (typeof error === "undefined") {
            throw new Error("The `taskError` is undefined");
          }
          return typeof render === "function" ? render(error, prevData) : render;
        }
        case TaskStatus.PENDING:
        default: {
          const render = (renderLoading ?? context.renderLoading) || null;
          return typeof render === "function" ? render(promise, prevData) : render;
        }
      }
    },
    [
      taskState,
      context.renderSuccess,
      context.renderError,
      context.renderLoading,
      options.defaultData,
    ],
  );

  return [suspenseRender, taskRunner, taskState.data, taskState.error, taskState.status];
};

export default useSuspenseRender;
