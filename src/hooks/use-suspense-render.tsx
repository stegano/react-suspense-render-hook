/* eslint-disable no-restricted-syntax */
import { useCallback, useContext, useMemo, useSyncExternalStore, useId } from "react";
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
import { Store } from "../store";

const globalStore = Store.createStore<TaskState<any, any>>();

const useSuspenseRender = <Data extends any = any, TaskError = Error | unknown>(
  options: Options<Data> = {},
  id: string | undefined = undefined,
): ReturnValues<Data, TaskError> => {
  const globalState = useSyncExternalStore(globalStore.subscribe, globalStore.getSnapshot);
  const uId = useId();
  const hookId = useMemo(() => id ?? uId, [id, uId]);
  const currState = useMemo<TaskState<Data, TaskError>>(() => {
    if (hookId in globalState) {
      return globalState[hookId];
    }
    if ("defaultData" in options) {
      return {
        status: TaskStatus.RESOLVED,
        data: options.defaultData,
      };
    }
    return { status: TaskStatus.PENDING };
  }, [globalState, hookId, options]);

  const context = useContext<ISuspenseRenderProvider.Context>(SuspenseRenderContext);

  /**
   * Run `task` function
   */
  const taskRunner: TaskRunner<Data> = useCallback(
    async (task, taskId?: string) => {
      try {
        const taskRunnerInterceptors = context.experimentals?.taskRunnerInterceptors;
        if (taskRunnerInterceptors) {
          let promise: Promise<any> | undefined;
          for (const taskRunnerInterceptor of taskRunnerInterceptors) {
            // eslint-disable-next-line no-await-in-loop
            promise = taskRunnerInterceptor(await promise, task, taskId) as any;
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            globalStore.set(hookId, (prev) => {
              return {
                promise,
                data: prev?.data,
                prevData: prev?.prevData,
                status: TaskStatus.PENDING,
              };
            });
          }
          const data = await promise;
          globalStore.set(hookId, (prev) => ({
            data,
            prevData: prev?.data,
            status: TaskStatus.RESOLVED,
          }));
          return data;
        }
        const promise = task(globalStore.get(hookId)?.data);
        globalStore.set(hookId, (prev) => ({
          data: prev?.data,
          prevData: prev?.prevData,
          status: TaskStatus.PENDING,
          promise,
        }));
        const data = await promise;
        globalStore.set(hookId, (prev) => ({
          data,
          prevData: prev?.data,
          status: TaskStatus.RESOLVED,
        }));
        return data;
      } catch (e) {
        const error = e as TaskError;
        globalStore.set(hookId, (prev) => ({
          error,
          data: prev?.data,
          prevData: prev?.prevData,
          status: TaskStatus.REJECTED,
        }));
        throw e;
      }
    },
    [context.experimentals?.taskRunnerInterceptors, hookId],
  );

  /**
   * Render component
   */
  const suspenseRender: SuspenseRender<Data, TaskError> = useCallback(
    (renderSuccess, renderLoading, renderError) => {
      const { data, prevData, status, error, promise } = currState;
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
      currState,
      context.renderSuccess,
      context.renderError,
      context.renderLoading,
      options.defaultData,
    ],
  );

  return [suspenseRender, taskRunner, currState.data, currState.error, currState.status];
};

export default useSuspenseRender;
