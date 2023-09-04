/**
 * Data processing status
 */
export declare enum Status {
    Pending = 0,
    Resolved = 1,
    Rejected = 2
}
/**
 * Async data processing fetcher function
 */
export interface Fetcher<R extends any = void | undefined> {
    (): Promise<R>;
}
