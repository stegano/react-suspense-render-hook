import { createContext, useMemo } from "react";
import { Context, Props } from "./suspense-render.interface";

export const SuspenseRenderContext = createContext<Context>({});

function SuspenseRenderProvider({ children, renderSuccess, renderLoading, renderError }: Props) {
  const state = useMemo(
    () => ({
      renderSuccess,
      renderLoading,
      renderError,
    }),
    [renderError, renderLoading, renderSuccess],
  );
  return <SuspenseRenderContext.Provider value={state}>{children}</SuspenseRenderContext.Provider>;
}

export default SuspenseRenderProvider;
