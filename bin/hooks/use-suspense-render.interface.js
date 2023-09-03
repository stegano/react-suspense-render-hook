"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
/**
 * Data processing status
 */
var Status;
(function (Status) {
    Status[Status["Pending"] = 0] = "Pending";
    Status[Status["Resolved"] = 1] = "Resolved";
    Status[Status["Rejected"] = 2] = "Rejected";
})(Status || (exports.Status = Status = {}));
