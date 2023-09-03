import { PropsWithChildren } from "react";
export interface Context {
    /**
     * 로딩 컴포넌트
     */
    loading?: JSX.Element;
    /**
     * 에러 컴포넌트
     */
    error?: JSX.Element;
}
export type Props = PropsWithChildren<Context>;
