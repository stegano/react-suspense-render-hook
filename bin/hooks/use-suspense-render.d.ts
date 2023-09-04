import { Fetcher } from "./use-suspense-render.interface";
declare const useSuspenseRedner: <R extends unknown = any>(fetcher: Fetcher<R>) => readonly [(success: JSX.Element, loading?: JSX.Element, error?: JSX.Element | undefined) => JSX.Element, () => void, R | undefined, unknown];
export default useSuspenseRedner;
