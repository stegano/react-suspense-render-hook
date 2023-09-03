/// <reference types="react" />
import { Context, Props } from "./render.interface";
export declare const RenderContext: import("react").Context<Context>;
declare function RenderProvider({ children, loading, error }: Props): import("react").JSX.Element;
export default RenderProvider;
