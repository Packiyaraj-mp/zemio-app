"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '10mb' }));
// auth routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
const friendsRoute_1 = __importDefault(require("./routes/friendsRoute"));
const ErrorHandler_1 = __importDefault(require("./middileWare/ErrorHandler"));
// auth ponts
app.use('/auth', authRoutes_1.default);
app.use('/file', fileRoutes_1.default);
app.use('/friends', friendsRoute_1.default);
// app.use('/stream',callRoutes);
app.use(ErrorHandler_1.default);
exports.default = app;
