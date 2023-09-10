import { type AsyncTask, type UseSuspenseRenderReturnValues } from "./use-suspense-render.interface";
declare const useSuspenseRedner: <Data extends unknown>(initAsyncTask?: AsyncTask<Data> | undefined) => UseSuspenseRenderReturnValues<Data>;
export default useSuspenseRedner;
