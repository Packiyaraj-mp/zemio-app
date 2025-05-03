"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncHandler = void 0;
const AsyncHandler = (fun) => (req, res, next) => Promise.resolve(fun(req, res, next)).catch(next);
exports.AsyncHandler = AsyncHandler;
