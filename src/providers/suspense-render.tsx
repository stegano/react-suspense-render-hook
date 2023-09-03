import { createContext, useMemo } from "react";
import { Context, Props } from "./suspense-render.interface";

export const SuspenseRenderContext = createContext<Context>({});

function SuspenseRenderProvider({ children, loading, error }: Props) {
  const state = useMemo(
    () => ({
      loading,
      error,
    }),
    [error, loading],
  );
  return <SuspenseRenderContext.Provider value={state}>{children}</SuspenseRenderContext.Provider>;
}

export default SuspenseRenderProvider;
