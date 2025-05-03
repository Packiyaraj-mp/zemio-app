"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GlobalErrorClass extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.isOperational = isOperational;
        this.message = message;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}
;
exports.default = GlobalErrorClass;
