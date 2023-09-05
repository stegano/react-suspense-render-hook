import { PropsWithChildren } from "react";
export interface Context {
    /**
     * Loading component
     */
    loading?: JSX.Element;
    /**
     * Error component
     */
    error?: JSX.Element;
}
export type Props = PropsWithChildren<Context>;
