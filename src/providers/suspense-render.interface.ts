import { PropsWithChildren } from "react";
import { SuspenseRenderElement } from "../hooks/use-suspense-render.interface";

export interface Context {
  /**
   * Loading component
   */
  loading?: SuspenseRenderElement;
  /**
   * Error component
   */
  error?: SuspenseRenderElement;
}

export type Props = PropsWithChildren<Context>;
