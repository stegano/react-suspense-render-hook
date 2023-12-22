import { ReactElement } from "react";
/**
 * The `TaskStatus` is task of each status.
 */
export declare enum TaskStatus {
    PENDING = "PENDING",
    RESOLVED = "RESOLVED",
    REJECTED = "REJECTED"
}
/**
 * The `Task` is a function that returns a promise.
 */
export interface Task<Data extends any = any> {
    (): Promise<Data>;
}
/**
 * The `TaskRunner` is a function that accepts an `Task`.
 */
export interface TaskRunner<Data> {
    (task: Task<Data>, taskId?: string): Promise<Data>;
}
/**
 * When the async task is resolved, the data will be passed to the success render function.
 */
export type RenderSuccessFunction<Data> = (data: Data, prevData?: Data) => ReactElement | null;
export type RenderSuccess<Data> = ReactElement | RenderSuccessFunction<Data> | null;
/**
 * When the async task is pending, the loading render function will be called.
 */
export type RenderLoadingFunction<Data> = (data?: Promise<Data>, prevData?: Data) => ReactElement | null;
export type RenderLoading<Data> = ReactElement | RenderLoadingFunction<Data> | null;
/**
 * When the async task is rejected, the error render function will be called.
 */
export type RenderErrorFunction<TaskError, Data> = (error: TaskError, prevData?: Data) => ReactElement | null;
export type RenderError<TaskError extends Error | unknown = unknown, Data extends any = any> = ReactElement | null | RenderErrorFunction<TaskError, Data>;
/**
 * The render function for the Suspense component.
 */
export interface SuspenseRender<Data = any, TaskError = any> {
    (renderSuccess?: RenderSuccess<Data>, renderLoading?: RenderLoading<Data>, renderError?: RenderError<TaskError, Data>): ReactElement | null;
}
/**
 * The `TaskState` is only used internally `useSuspenseRender` hook.
 */
export interface TaskState<Data, TaskError> {
    status: TaskStatus;
    error?: TaskError;
    promise?: Promise<Data>;
    data?: Data;
    prevData?: Data;
}
/**
 * The return values of the `useSuspenseRender` hook.
 */
export type ReturnValues<Data, TaskError> = [
    SuspenseRender<Data, TaskError>,
    TaskRunner<Data>,
    Data | undefined,
    TaskError | undefined,
    TaskStatus
];
/**
 * The options of the `useSuspenseRender` hook.
 */
export interface Options<Data extends any = any> {
    /**
     * The default data.
     */
    defaultData?: Data;
}
