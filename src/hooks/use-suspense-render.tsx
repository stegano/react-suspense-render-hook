import { useState, useCallback, useContext } from "react";
import {
  AsyncTaskStatus,
  type SuspenseRender,
  type ReturnValues,
  type AsyncTaskRunner,
  AsyncState,
  Options,
} from "./use-suspense-render.interface";
import { SuspenseRenderContext } from "../providers";

const useSuspenseRedner = <Data extends any = any, AsyncTaskError = Error | unknown>(
  options: Options = {
    immediatelyRenderSuccess: false,
  },
): ReturnValues<Data, AsyncTaskError> => {
  const [asyncState, setAsyncState] = useState<AsyncState<Data, AsyncTaskError>>({
    taskStatus: options.immediatelyRenderSuccess
      ? AsyncTaskStatus.RESOLVED
      : AsyncTaskStatus.PENDING,
  });
  const configure = useContext(SuspenseRenderContext);

  /**
   * Run `asyncTask` function
   */
  const runAsyncTask: AsyncTaskRunner<Data> = useCallback((asyncTask) => {
    setAsyncState({ taskStatus: AsyncTaskStatus.PENDING });
    const taskPromise = asyncTask();
    taskPromise
      .then((value) => {
        setAsyncState({
          taskStatus: AsyncTaskStatus.RESOLVED,
          data: value,
          taskPromise,
        });
      })
      .catch((taskError) => {
        setAsyncState({
          taskStatus: AsyncTaskStatus.REJECTED,
          taskError,
          taskPromise,
        });
      });
    return taskPromise;
  }, []);

  /**
   * Render component
   */
  const suspenseRender: SuspenseRender<Data, AsyncTaskError> = useCallback(
    (renderSuccess, renderLoading, renderError) => {
      const { data, taskStatus, taskError, taskPromise } = asyncState;
      switch (taskStatus) {
        case AsyncTaskStatus.RESOLVED: {
          const render = typeof renderSuccess !== "undefined" ? renderSuccess : configure.success;
          return typeof render === "function" ? render(data as Data) : render;
        }
        case AsyncTaskStatus.REJECTED: {
          const render = typeof renderError !== "undefined" ? renderError : configure.error;
          if (!render) {
            /**
             * Propagate the error upwards if the error component does not exist,
             * so that it can be handled at the error boundary.
             */
            if (taskError instanceof Error) {
              throw taskError;
            }
          }
          if (typeof taskError === "undefined") {
            throw new Error("The `taskError` is undefined");
          }
          return typeof render === "function" ? render(taskError) : render;
        }
        case AsyncTaskStatus.PENDING:
        default: {
          const render = typeof renderLoading !== "undefined" ? renderLoading : configure.loading;
          return typeof render === "function" ? render(taskPromise) : render;
        }
      }
    },
    [asyncState, configure.error, configure.loading, configure.success],
  );

  return [
    suspenseRender,
    runAsyncTask,
    asyncState.data,
    asyncState.taskError,
    asyncState.taskStatus,
  ];
};

export default useSuspenseRedner;
