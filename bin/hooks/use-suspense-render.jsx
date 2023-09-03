"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const use_suspense_render_interface_1 = require("./use-suspense-render.interface");
const providers_1 = require("../providers");
const useSuspenseRedner = (fetcher) => {
    const [status, setStatus] = (0, react_1.useState)(use_suspense_render_interface_1.Status.Pending);
    const [data, setData] = (0, react_1.useState)(undefined);
    const [dataProcessingError, setDataProcessing] = (0, react_1.useState)(undefined);
    const configure = (0, react_1.useContext)(providers_1.SuspenseRenderContext);
    (0, react_1.useEffect)(() => {
        fetcher()
            .then((value) => {
            setStatus(use_suspense_render_interface_1.Status.Resolved);
            setData(value);
        })
            .catch((e) => {
            setStatus(use_suspense_render_interface_1.Status.Rejected);
            setDataProcessing(e);
        });
    }, [fetcher]);
    /**
     * Re-fetch data
     */
    const reFetch = (0, react_1.useCallback)(() => {
        setStatus(use_suspense_render_interface_1.Status.Pending);
        fetcher()
            .then((value) => {
            setStatus(use_suspense_render_interface_1.Status.Resolved);
            setData(value);
        })
            .catch((e) => {
            setStatus(use_suspense_render_interface_1.Status.Rejected);
            setDataProcessing(e);
        });
    }, [fetcher]);
    /**
     * Render component
     */
    const suspenseRender = (0, react_1.useCallback)((success, loading = configure.loading || success, error = configure.error) => {
        switch (status) {
            case use_suspense_render_interface_1.Status.Resolved:
                return success;
            case use_suspense_render_interface_1.Status.Rejected:
                if (error === undefined) {
                    /**
                     * Propagate the error upwards if the error component does not exist,
                     * so that it can be handled at the error boundary.
                     */
                    throw dataProcessingError;
                }
                return error;
            case use_suspense_render_interface_1.Status.Pending:
            default:
                return loading;
        }
    }, [configure.error, configure.loading, dataProcessingError, status]);
    return [suspenseRender, reFetch, data, dataProcessingError];
};
exports.default = useSuspenseRedner;
