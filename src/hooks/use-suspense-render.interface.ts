/**
 * Data processing status
 */
export enum Status {
  Pending,
  Resolved,
  Rejected,
}

export interface AsyncTask<R extends any = void | undefined> {
  (): Promise<R>;
}

export interface ReRunAsyncTask {
  (): void;
}

export type SuspenseRenderElement = JSX.Element | undefined | null;

export interface SuspenseRender {
  (
    success: SuspenseRenderElement,
    loading?: SuspenseRenderElement,
    error?: SuspenseRenderElement,
  ): SuspenseRenderElement;
}

export type AsyncTaskError = Error | unknown;

export type UseSuspenseRenderReturnValues<Data> = [
  SuspenseRender,
  ReRunAsyncTask,
  Data | undefined,
  AsyncTaskError | undefined,
];
