"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnection = () => {
    mongoose_1.default.connect('mongodb+srv://packiyaraj:Raj357890@shomo.tsgni.mongodb.net/?retryWrites=true&w=majority&appName=shomo')
        .then(conn => console.log(`db is connected with ${conn.connection.host}`));
};
exports.default = dbConnection;
