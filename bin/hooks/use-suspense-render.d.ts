import { type AsyncTask, type UseSuspenseRenderReturnValues } from "./use-suspense-render.interface";
declare const useSuspenseRedner: <Data extends unknown>(asyncTask: AsyncTask<Data>) => UseSuspenseRenderReturnValues<Data>;
export default useSuspenseRedner;
