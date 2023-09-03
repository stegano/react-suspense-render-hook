/// <reference types="react" />
import { Context, Props } from "./suspense-render.interface";
export declare const SuspenseRenderContext: import("react").Context<Context>;
declare function SuspenseRenderProvider({ children, loading, error }: Props): import("react").JSX.Element;
export default SuspenseRenderProvider;
