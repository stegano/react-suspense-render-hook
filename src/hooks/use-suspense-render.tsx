/* eslint-disable no-restricted-syntax */
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
  options: Options<Data> = {},
): ReturnValues<Data, TaskError> => {
  const [taskState, setTaskState] = useState<TaskState<Data, TaskError>>({
    status: "defaultData" in options ? TaskStatus.RESOLVED : TaskStatus.PENDING,
  });
  const context = useContext<ISuspenseRenderProvider.Context>(SuspenseRenderContext);
  /**
   * Run `task` function
   */
  const taskRunner: TaskRunner<Data, TaskError> = useCallback(
    async (task, taskId?: string) => {
      try {
        const taskRunnerInterceptors = context.experimentals?.taskRunnerInterceptors;
        if (taskRunnerInterceptors) {
          let taskResult;
          for (const taskRunnerInterceptor of taskRunnerInterceptors) {
            // eslint-disable-next-line no-await-in-loop
            taskResult = taskRunnerInterceptor(await taskResult, task, taskId);
            const promise = taskResult instanceof Promise ? taskResult : undefined;
            setTaskState({ status: TaskStatus.PENDING, promise });
          }
          const data = await taskResult;
          setTaskState({ status: TaskStatus.RESOLVED, data });
          return data;
        }
        const taskResult = task();
        const promise = taskResult instanceof Promise ? taskResult : undefined;
        setTaskState({ status: TaskStatus.PENDING, promise });
        const data = await taskResult;
        setTaskState({ status: TaskStatus.RESOLVED, data });
        return data;
      } catch (e) {
        const error = e as TaskError;
        setTaskState({ status: TaskStatus.REJECTED, error });
        return error;
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
          const render = (renderSuccess ?? context.renderSuccess) || null;
          return typeof render === "function"
            ? render((data ?? options.defaultData) as Data)
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
          return typeof render === "function" ? render(error) : render;
        }
        case TaskStatus.PENDING:
        default: {
          const render = (renderLoading ?? context.renderLoading) || null;
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
