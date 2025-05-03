"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ErrorHandler = (err, req, res, next) => {
    let message = err.message ? err.message : 'internal server error';
    let statusCode = err.statusCode ? err.statusCode : 500;
    console.log(err.message);
    if (err.name === 'ValidationError' && err instanceof mongoose_1.default.Error.ValidationError) {
        message = Object.values(err.errors)[0].message;
        statusCode = 500;
    }
    ;
    if (err.name === 'CastError' && err instanceof mongoose_1.default.Error.CastError) {
        statusCode = 400,
            message = `Invalid ${err.path}:${err.value}`;
    }
    ;
    if (err.name === 'BcryptError' || err.message.includes('bcrypt')) {
        statusCode = 500,
            message = 'Password encryption error';
    }
    ;
    if (err.name === 'JsonWebTokenError') {
        statusCode = 500,
            message = 'Invalid Token';
    }
    ;
    if (err.name === 'TokenExpiredError') {
        statusCode = 500,
            message = 'Token Expired';
    }
    ;
    if (err.code === 11000) {
        statusCode = 500,
            message = 'Dublicate key error';
    }
    ;
    if (err.message.includes('Salt')) {
        message = 'Internal encryption errors',
            statusCode = 500;
    }
    res.status(statusCode).json({
        msg: message,
        success: false
    });
};
exports.default = ErrorHandler;
