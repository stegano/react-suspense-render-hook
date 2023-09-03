/**
 * Data processing status
 */
export enum Status {
  Pending,
  Resolved,
  Rejected,
}

/**
 * Async data processing fetcher function
 */
export interface Fetcher<R extends any = void | undefined> {
  (): Promise<R>;
}
