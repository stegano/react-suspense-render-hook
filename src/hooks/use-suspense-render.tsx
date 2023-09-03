import { useState, useEffect, useCallback, useContext } from "react";
import { Fetcher, Status } from "./use-suspense-render.interface";
import { SuspenseRenderContext } from "../providers";

const useSuspenseRedner = <R extends any = any>(fetcher: Fetcher<R>) => {
  const [status, setStatus] = useState<Status>(Status.Pending);
  const [data, setData] = useState<R | undefined>(undefined);
  const [dataProcessingError, setDataProcessing] = useState<unknown>(undefined);

  const configure = useContext(SuspenseRenderContext);

  useEffect(() => {
    fetcher()
      .then((value) => {
        setStatus(Status.Resolved);
        setData(value);
      })
      .catch((e) => {
        setStatus(Status.Rejected);
        setDataProcessing(e);
      });
  }, [fetcher]);

  /**
   * Re-fetch data
   */
  const reFetch = useCallback(() => {
    setStatus(Status.Pending);
    fetcher()
      .then((value) => {
        setStatus(Status.Resolved);
        setData(value);
      })
      .catch((e) => {
        setStatus(Status.Rejected);
        setDataProcessing(e);
      });
  }, [fetcher]);

  /**
   * Render component
   */
  const suspenseRender = useCallback(
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
            throw dataProcessingError;
          }
          return error;
        case Status.Pending:
        default:
          return loading;
      }
    },
    [configure.error, configure.loading, dataProcessingError, status],
  );

  return [suspenseRender, reFetch, data, dataProcessingError] as const;
};

export default useSuspenseRedner;
