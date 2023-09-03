"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuspenseRenderContext = void 0;
const react_1 = require("react");
exports.SuspenseRenderContext = (0, react_1.createContext)({});
function SuspenseRenderProvider({ children, loading, error }) {
    const state = (0, react_1.useMemo)(() => ({
        loading,
        error,
    }), [error, loading]);
    return <exports.SuspenseRenderContext.Provider value={state}>{children}</exports.SuspenseRenderContext.Provider>;
}
exports.default = SuspenseRenderProvider;
