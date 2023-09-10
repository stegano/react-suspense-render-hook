import { useState, useEffect, useCallback, useContext } from "react";
import {
  Status,
  type AsyncTask,
  type SuspenseRender,
  type UseSuspenseRenderReturnValues,
  type RunAsyncTask,
} from "./use-suspense-render.interface";
import { SuspenseRenderContext } from "../providers";

const useSuspenseRedner = <Data extends any>(
  initAsyncTask?: AsyncTask<Data>,
): UseSuspenseRenderReturnValues<Data> => {
  const [status, setStatus] = useState<Status>(Status.Pending);
  const [data, setData] = useState<Data | undefined>(undefined);
  const [asyncTaskError, setAsyncTaskError] = useState<unknown>(undefined);

  const configure = useContext(SuspenseRenderContext);

  useEffect(() => {
    initAsyncTask?.()
      .then((value) => {
        setStatus(Status.Resolved);
        setData(value);
      })
      .catch((e) => {
        setStatus(Status.Rejected);
        setAsyncTaskError(e);
      });
  }, [initAsyncTask]);

  /**
   * Run `asyncTask` function
   */
  const runAsyncTask: RunAsyncTask<Data> = useCallback((asyncTask) => {
    setStatus(Status.Pending);
    asyncTask()
      .then((value) => {
        setStatus(Status.Resolved);
        setData(value);
      })
      .catch((e) => {
        setStatus(Status.Rejected);
        setAsyncTaskError(e);
      });
  }, []);

  /**
   * Render component
   */
  const suspenseRender: SuspenseRender = useCallback(
    (success, loading, error) => {
      switch (status) {
        case Status.Resolved:
          return success;
        case Status.Rejected:
          if (!error) {
            /**
             * Propagate the error upwards if the error component does not exist,
             * so that it can be handled at the error boundary.
             */
            throw asyncTaskError;
          }
          return error;
        case Status.Pending:
        default:
          return loading;
      }
    },
    [configure.error, configure.loading, asyncTaskError, status],
  );

  return [suspenseRender, runAsyncTask, data, asyncTaskError];
};

export default useSuspenseRedner;
