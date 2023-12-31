import { type ReturnValues, Options } from "./use-suspense-render.interface";
declare const useSuspenseRender: <Data extends unknown = any, TaskError = unknown>(options?: Options<Data>, id?: string | undefined) => ReturnValues<Data, TaskError>;
export default useSuspenseRender;
