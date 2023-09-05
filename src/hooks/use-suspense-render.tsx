import { useState, useEffect, useCallback, useContext } from "react";
import {
  Status,
  type AsyncTask,
  type ReRunAsyncTask,
  type SuspenseRender,
  type UseSuspenseRenderReturnValues,
} from "./use-suspense-render.interface";
import { SuspenseRenderContext } from "../providers";

const useSuspenseRedner = <Data extends any>(
  asyncTask: AsyncTask<Data>,
): UseSuspenseRenderReturnValues<Data> => {
  const [status, setStatus] = useState<Status>(Status.Pending);
  const [data, setData] = useState<Data | undefined>(undefined);
  const [asyncTaskError, setAsyncTaskError] = useState<unknown>(undefined);

  const configure = useContext(SuspenseRenderContext);

  useEffect(() => {
    asyncTask()
      .then((value) => {
        setStatus(Status.Resolved);
        setData(value);
      })
      .catch((e) => {
        setStatus(Status.Rejected);
        setAsyncTaskError(e);
      });
  }, [asyncTask]);

  /**
   * Re-run `asyncTask` function
   */
  const reRunAsyncTask: ReRunAsyncTask = useCallback(() => {
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
  }, [asyncTask]);

  /**
   * Render component
   */
  const suspenseRender: SuspenseRender = useCallback(
    (
      success: JSX.Element,
      loading: JSX.Element = configure.loading || success,
      error: JSX.Element | undefined = configure.error,
    ) => {
      switch (status) {
        case Status.Resolved:
          return success;
        case Status.Rejected:
          if (error === undefined) {
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

  return [suspenseRender, reRunAsyncTask, data, asyncTaskError];
};

export default useSuspenseRedner;
