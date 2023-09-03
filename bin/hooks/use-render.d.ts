/// <reference types="react" />
import { Fetcher } from "./use-render.interface";
declare const useRedner: <R extends unknown = any>(fetcher: Fetcher<R>) => readonly [(success: JSX.Element, loading?: JSX.Element, error?: JSX.Element | undefined) => JSX.Element, () => void, R | undefined, unknown];
export default useRedner;
