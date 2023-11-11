import { useState, useCallback, useContext } from "react";
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

const useSuspenseRender = <Data extends any = any, TaskError = Error | unknown>(
  options: Options<Data> = {
    defaultData: undefined,
  },
): ReturnValues<Data, TaskError> => {
  const [taskState, setTaskState] = useState<TaskState<Data, TaskError>>({
    status: options.defaultData ? TaskStatus.RESOLVED : TaskStatus.PENDING,
  });
  const context = useContext<ISuspenseRenderProvider.Context>(SuspenseRenderContext);
  /**
   * Run `task` function
   */
  const taskRunner: TaskRunner<Data> = useCallback(
    (task, taskId?: string) => {
      try {
        const taskRunnerInterceptor = context.experimentals?.taskRunnerInterceptor;
        const promise = taskRunnerInterceptor ? taskRunnerInterceptor(task, taskId) : task();
        if (promise instanceof Promise) {
          setTaskState({ status: TaskStatus.PENDING, promise });
          promise
            .then((data) => {
              setTaskState({
                status: TaskStatus.RESOLVED,
                data,
                promise,
              });
            })
            .catch((error) => {
              setTaskState({
                status: TaskStatus.REJECTED,
                error,
                promise,
              });
            });
          return;
        }
        const data = promise;
        setTaskState({ status: TaskStatus.RESOLVED, data });
      } catch (e) {
        const error = e as TaskError;
        setTaskState({ status: TaskStatus.REJECTED, error });
        throw e;
      }
    },
    [context],
  );

  /**
   * Render component
   */
  const suspenseRender: SuspenseRender<Data, TaskError> = useCallback(
    (renderSuccess, renderLoading, renderError) => {
      const { data, status, error, promise } = taskState;
      switch (status) {
        case TaskStatus.RESOLVED: {
          const render = renderSuccess ?? context.renderSuccess;
          return typeof render === "function"
            ? render((data || options.defaultData) as Data)
            : render;
        }
        case TaskStatus.REJECTED: {
          const render = renderError ?? context.renderError;
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
          return typeof render === "function" ? render(error) : render;
        }
        case TaskStatus.PENDING:
        default: {
          const render = renderLoading ?? context.renderLoading;
          return typeof render === "function" ? render(promise) : render;
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
