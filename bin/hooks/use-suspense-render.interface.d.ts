/// <reference types="react" />
/**
 * Data processing status
 */
export declare enum Status {
    Pending = 0,
    Resolved = 1,
    Rejected = 2
}
export interface AsyncTask<R extends any = void | undefined> {
    (): Promise<R>;
}
export interface RunAsyncTask<T extends any = any> {
    (asyncTask: AsyncTask<T>): void;
}
export type SuspenseRenderElement = JSX.Element | undefined | null;
export interface SuspenseRender {
    (success: SuspenseRenderElement, loading?: SuspenseRenderElement, error?: SuspenseRenderElement): SuspenseRenderElement;
}
export type AsyncTaskError = Error | unknown;
export type UseSuspenseRenderReturnValues<Data> = [
    SuspenseRender,
    RunAsyncTask<Data>,
    Data | undefined,
    AsyncTaskError | undefined,
    Status
];
