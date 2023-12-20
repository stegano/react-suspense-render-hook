/* eslint-disable no-restricted-syntax */
import { useState, useCallback, useContext, useRef, useEffect } from "react";
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

/**
 * A global event emitter for `useSuspenseRender`
 */
const emitter = new EventEmitter<string, TaskState<any, any>>();

const useSuspenseRender = <Data extends any = any, TaskError = Error | unknown>(
  options: Options<Data> = {},
  id: string | undefined = undefined,
): ReturnValues<Data, TaskError> => {
  const latestDataRef = useRef<Data | undefined>(options.defaultData);
  const [taskState, setTaskState] = useState<TaskState<Data, TaskError>>({
    status: "defaultData" in options ? TaskStatus.RESOLVED : TaskStatus.PENDING,
  });

  const context = useContext<ISuspenseRenderProvider.Context>(SuspenseRenderContext);

  useEffect(() => {
    /**
     * Subscribe to the event emitter
     */
    if (id) {
      const handleEmit = (data: TaskState<Data, TaskError>) => {
        setTaskState(data);
      };
      emitter.on(id, handleEmit);
      return () => {
        emitter.off(id, handleEmit);
      };
    }
    return () => {};
  }, [id]);

  /**
   * Update task status
   */
  const updateTaskStatus = useCallback((data: TaskState<Data, TaskError>, sharedId?: string) => {
    if (sharedId) {
      /**
       * Update global status
       */
      emitter.emit(sharedId, data);
    } else {
      /**
       * Update local status
       */
      setTaskState(data);
    }
  }, []);

  /**
   * Run `task` function
   */
  const taskRunner: TaskRunner<Data> = useCallback(
    async (task, taskId?: string) => {
      try {
        const taskRunnerInterceptors = context.experimentals?.taskRunnerInterceptors;
        if (taskRunnerInterceptors) {
          let taskResult;
          for (const taskRunnerInterceptor of taskRunnerInterceptors) {
            // eslint-disable-next-line no-await-in-loop
            taskResult = taskRunnerInterceptor(await taskResult, task, taskId);
            updateTaskStatus({ status: TaskStatus.PENDING, promise: taskResult }, id);
          }
          const data = await taskResult;
          updateTaskStatus({ status: TaskStatus.RESOLVED, data }, id);
          return data;
        }
        const promise = task();
        updateTaskStatus({ status: TaskStatus.PENDING, promise }, id);
        const data = await promise;
        updateTaskStatus({ status: TaskStatus.RESOLVED, data }, id);
        return data;
      } catch (e) {
        const error = e as TaskError;
        updateTaskStatus({ status: TaskStatus.REJECTED, error }, id);
        throw e;
      }
    },
    [context.experimentals?.taskRunnerInterceptors, id, updateTaskStatus],
  );

  /**
   * Render component
   */
  const suspenseRender: SuspenseRender<Data, TaskError> = useCallback(
    (renderSuccess, renderLoading, renderError) => {
      const { data, status, error, promise } = taskState;
      const prevData = latestDataRef.current;
      switch (status) {
        case TaskStatus.RESOLVED: {
          const render = (renderSuccess ?? context.renderSuccess) || null;
          latestDataRef.current = data;
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
