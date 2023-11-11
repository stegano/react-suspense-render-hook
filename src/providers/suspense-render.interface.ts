import { PropsWithChildren } from "react";
import { RenderError, RenderLoading, RenderSuccess } from "../hooks/use-suspense-render.interface";

export interface Context<Data extends any = any, TaskError extends Error | unknown = unknown> {
  /**
   * The `success` component or render function.
   */
  renderSuccess?: RenderSuccess<Data>;
  /**
   * The `loading` component or render function.
   */
  renderLoading?: RenderLoading<Data>;
  /**
   * The `error` component or render function.
   */
  renderError?: RenderError<TaskError>;
}

export type Props = PropsWithChildren<Context>;
