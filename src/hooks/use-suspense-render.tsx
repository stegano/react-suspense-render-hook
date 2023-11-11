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
  const runTask: TaskRunner<Data> = useCallback((task) => {
    const promise = task();
    if (promise instanceof Promise) {
      setTaskState({ status: TaskStatus.PENDING, promise });
      promise
        .then((value) => {
          setTaskState({
            status: TaskStatus.RESOLVED,
            data: value,
            promise,
          });
        })
        .catch((taskError) => {
          setTaskState({
            status: TaskStatus.REJECTED,
            error: taskError,
            promise,
          });
        });
      return task;
    }
    // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
    const _promise = Promise.resolve(promise);
    setTaskState({ status: TaskStatus.PENDING, promise: _promise });
    return _promise;
  }, []);

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

  return [suspenseRender, runTask, taskState.data, taskState.error, taskState.status];
};

export default useSuspenseRender;
