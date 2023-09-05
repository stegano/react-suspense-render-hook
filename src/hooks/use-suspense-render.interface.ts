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

export interface SuspenseRender {
  (success: JSX.Element, loading?: JSX.Element, error?: JSX.Element): JSX.Element | undefined;
}

export type AsyncTaskError = Error | unknown;

export type UseSuspenseRenderReturnValues<Data> = [
  SuspenseRender,
  ReRunAsyncTask,
  Data | undefined,
  AsyncTaskError | undefined,
];
