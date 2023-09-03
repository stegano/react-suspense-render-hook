"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderContext = void 0;
const react_1 = require("react");
exports.RenderContext = (0, react_1.createContext)({});
function RenderProvider({ children, loading, error }) {
    const state = (0, react_1.useMemo)(() => ({
        loading,
        error,
    }), [error, loading]);
    return <exports.RenderContext.Provider value={state}>{children}</exports.RenderContext.Provider>;
}
exports.default = RenderProvider;
