import { createContext, useMemo } from "react";
import { Context, Props } from "./suspense-render.interface";

export const SuspenseRenderContext = createContext<Context>({});

function SuspenseRenderProvider({
  children,
  renderSuccess,
  renderLoading,
  renderError,
  experimentals,
}: Props) {
  const state = useMemo(
    () => ({
      renderSuccess,
      renderLoading,
      renderError,
      experimentals,
    }),
    [renderError, renderLoading, renderSuccess, experimentals],
  );
  return <SuspenseRenderContext.Provider value={state}>{children}</SuspenseRenderContext.Provider>;
}

export default SuspenseRenderProvider;
