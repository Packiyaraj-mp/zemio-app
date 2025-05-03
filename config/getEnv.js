"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config/.env' });
const getEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable error`);
    }
    return value;
};
exports.default = getEnv;
