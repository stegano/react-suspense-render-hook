import { PropsWithChildren } from "react";
import { SuspenseRenderError, SuspenseRenderLoading, SuspenseRenderSuccess } from "../hooks/use-suspense-render.interface";
export interface Context<Data extends any = any, AsyncTaskError extends Error | unknown = unknown> {
    /**
     * The `success` component or render function.
     */
    success?: SuspenseRenderSuccess<Data>;
    /**
     * The `loading` component or render function.
     */
    loading?: SuspenseRenderLoading<Data>;
    /**
     * The `error` component or render function.
     */
    error?: SuspenseRenderError<AsyncTaskError>;
}
export type Props = PropsWithChildren<Context>;
