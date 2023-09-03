/**
 * 데이터 처리 상태
 */
export declare enum Status {
    Pending = 0,
    Resolved = 1,
    Rejected = 2
}
/**
 * 비동기 데이터 조회 함수
 */
export interface Fetcher<R extends any = void | undefined> {
    (): Promise<R>;
}
