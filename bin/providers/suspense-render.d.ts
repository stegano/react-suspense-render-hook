/// <reference types="react" />
import { Context, Props } from "./suspense-render.interface";
export declare const SuspenseRenderContext: import("react").Context<Context<any, unknown>>;
declare function SuspenseRenderProvider({ children, renderSuccess, renderLoading, renderError, experimentals, }: Props): import("react/jsx-runtime").JSX.Element;
export default SuspenseRenderProvider;
