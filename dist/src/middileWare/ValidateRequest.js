"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const GlobalError_1 = __importDefault(require("../utils/GlobalError"));
const AsyncHandler_1 = require("./AsyncHandler");
const validateRequest = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new GlobalError_1.default(errors.array({ onlyFirstError: true })[0].msg, 500));
    }
    next();
});
exports.default = validateRequest;
