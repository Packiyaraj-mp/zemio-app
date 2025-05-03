"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordReqValidation = exports.resetEmailCodeVerifyValidation = exports.resetPasswordValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const GlobalError_1 = __importDefault(require("../utils/GlobalError"));
exports.registerValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty().withMessage('User name is required')
        .isString().withMessage('Name should be in string format')
        .isLength({ min: 3 }).withMessage('Minimum 3 characters required')
        .matches(/^[A-Za-z ]+$/).withMessage('Name should contain only letters and spaces')
        .matches(/^\S(?:.*\S)?$/).withMessage('Name should not have leading or trailing spaces'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isString().withMessage('Email should be in string format')
        .isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
        .trim()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^\S*$/).withMessage('Password should not contain spaces')
        .matches(/[A-Z]/).withMessage('At least one uppercase letter is required')
        .matches(/[a-z]/).withMessage('At least one lowercase letter is required')
        .matches(/\d/).withMessage('At least one digit is required')
        .matches(/[@$!%*?&]/).withMessage('At least one special character is required'),
    // Confirm Password Validation
    (0, express_validator_1.body)('confirmPassword')
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new GlobalError_1.default('Passwords do not match', 500);
        }
        return true;
    })
];
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isString().withMessage('Email should be in string format')
        .isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
        .trim()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^\S*$/).withMessage('Password should not contain spaces')
        .matches(/[A-Z]/).withMessage('At least one uppercase letter is required')
        .matches(/[a-z]/).withMessage('At least one lowercase letter is required')
        .matches(/\d/).withMessage('At least one digit is required')
        .matches(/[@$!%*?&]/).withMessage('At least one special character is required'),
];
exports.resetPasswordValidation = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isString().withMessage('Email should be in string format')
        .isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
        .trim()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^\S*$/).withMessage('Password should not contain spaces')
        .matches(/[A-Z]/).withMessage('At least one uppercase letter is required')
        .matches(/[a-z]/).withMessage('At least one lowercase letter is required')
        .matches(/\d/).withMessage('At least one digit is required')
        .matches(/[@$!%*?&]/).withMessage('At least one special character is required'),
    // Confirm Password Validation
    (0, express_validator_1.body)('confirmPassword')
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new GlobalError_1.default('Passwords do not match', 500);
        }
        return true;
    }),
    // token validation
    (0, express_validator_1.body)('token')
        .notEmpty().withMessage('token is required')
        .isString().withMessage('token should be string')
];
exports.resetEmailCodeVerifyValidation = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isString().withMessage('Email should be in string format')
        .isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('code')
        .trim()
        .notEmpty().withMessage('code is required')
        .isString().withMessage('code should be string')
];
exports.resetPasswordReqValidation = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isString().withMessage('Email should be in string format')
        .isEmail().withMessage('Invalid email format'),
];
