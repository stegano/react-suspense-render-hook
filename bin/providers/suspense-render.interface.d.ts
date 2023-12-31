import { PropsWithChildren } from "react";
import type { RenderError, RenderLoading, RenderSuccess, Task } from "../hooks/use-suspense-render.interface";
export interface TaskRunnerInterceptor<Data extends any = any> {
    (prevData: Data | undefined, task: Task<Data>, taskId?: string): Promise<Data>;
}
export interface Context<Data extends any = any, TaskError extends Error | unknown = unknown> {
    /**
     * The `success` component or render function.
     */
    renderSuccess?: RenderSuccess<Data>;
    /**
     * The `loading` component or render function.
     */
    renderLoading?: RenderLoading<Data>;
    /**
     * The `error` component or render function.
     */
    renderError?: RenderError<TaskError, Data>;
    /**
     * Experimentals
     */
    experimentals?: {
        /**
         * `taskRunnerInterceptors` can intercept and transform input tasks.
         */
        taskRunnerInterceptors?: TaskRunnerInterceptor<Data>[];
    };
}
export type Props = PropsWithChildren<Context>;
