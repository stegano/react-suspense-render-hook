/// <reference types="react" />
/**
 * The `AsyncTaskStatus` is task of each status.
 */
export declare enum AsyncTaskStatus {
    PENDING = 0,
    RESOLVED = 1,
    REJECTED = 2
}
/**
 * The `AsyncTask` is a function that returns a promise.
 */
export interface AsyncTask<Data extends any = any> {
    (): Promise<Data>;
}
/**
 * The `AsyncTaskRunner` is a function that accepts an `AsyncTask`.
 */
export interface AsyncTaskRunner<Data extends any = any> {
    (asyncTask: AsyncTask<Data>): void;
}
/**
 * When the async task is resolved, the data will be passed to the success render function.
 */
export type SuspenseRenderSuccess<Data> = React.ReactNode | ((data: Data) => React.ReactNode);
/**
 * When the async task is pending, the loading render function will be called.
 */
export type SuspenseRenderLoading<Data> = React.ReactNode | ((data?: Promise<Data>) => React.ReactNode);
/**
 * When the async task is rejected, the error render function will be called.
 */
export type SuspenseRenderError<AsyncTaskError extends Error | unknown = unknown> = React.ReactNode | ((error: AsyncTaskError) => React.ReactNode);
/**
 * The render function for the Suspense component.
 */
export interface SuspenseRender<Data = any, AsyncTaskError = any> {
    (success?: SuspenseRenderSuccess<Data>, loading?: SuspenseRenderLoading<Data>, error?: SuspenseRenderError<AsyncTaskError>): React.ReactNode;
}
/**
 * The `AsyncState` is only used internally `useSuspenseRender` hook.
 */
export interface AsyncState<Data, AsyncTaskError> {
    taskStatus: AsyncTaskStatus;
    taskError?: AsyncTaskError;
    taskPromise?: Promise<Data>;
    data?: Data;
}
/**
 * The return values of the `useSuspenseRender` hook.
 */
export type UseSuspenseRenderReturnValues<Data, AsyncTaskError> = [
    SuspenseRender<Data, AsyncTaskError>,
    AsyncTaskRunner<Data>,
    Data | undefined,
    AsyncTaskError | undefined,
    AsyncTaskStatus
];
