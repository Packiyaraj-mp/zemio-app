"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordController = exports.ResetEmailCodeVerifyController = exports.ResetPasswordReqController = exports.AuthenticateController = exports.LoginController = exports.RegisterController = void 0;
const AsyncHandler_1 = require("../middileWare/AsyncHandler");
const authShema_1 = __importDefault(require("../models/ModelShema/authShema"));
const GlobalError_1 = __importDefault(require("../utils/GlobalError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getEnv_1 = __importDefault(require("../../config/getEnv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: (0, getEnv_1.default)('AWS_ACCESS_KEY'),
    secretAccessKey: (0, getEnv_1.default)('AWS_SECRET_KEY'),
    region: 'us-east-1'
});
exports.RegisterController = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const isUser = yield authShema_1.default.findOne({ email: email });
    if (isUser) {
        return next(new GlobalError_1.default('User already exist', 500));
    }
    const newUser = yield authShema_1.default.create({
        name,
        email,
        password
    });
    res.status(200).json({
        msg: 'successfully user created',
        status: true
    });
}));
exports.LoginController = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const isUser = yield authShema_1.default.findOne({ email: String(email).toLowerCase() });
    if (!isUser) {
        return next(new GlobalError_1.default('User does not exist', 500));
    }
    const isMatch = yield isUser.comparePassword(password);
    if (!isMatch) {
        return next(new GlobalError_1.default('Invalid password', 500));
    }
    // generate token
    const token = isUser.get_jwt_token();
    let profileUrl = null;
    if (isUser.profileUrl !== null) {
        const signedUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: isUser.profileUrl,
            Expires: 300
        });
        if (signedUrl) {
            profileUrl = signedUrl;
        }
    }
    //  send success response
    if (token) {
        res.status(200).json({
            token,
            user: {
                name: isUser.name,
                email: isUser.email,
                userId: isUser._id,
                profileUrl
            }
        });
    }
    ;
}));
exports.AuthenticateController = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, id } = req.user;
    const isUser = yield authShema_1.default.findById(id);
    if (!isUser) {
        return next(new GlobalError_1.default('user does not exist with this token', 400));
    }
    let profileUrl = null;
    if (isUser.profileUrl !== null) {
        const signedUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: isUser.profileUrl,
            Expires: 300
        });
        if (signedUrl) {
            profileUrl = signedUrl;
        }
    }
    res.status(200).json({
        name: isUser === null || isUser === void 0 ? void 0 : isUser.name,
        email: isUser === null || isUser === void 0 ? void 0 : isUser.email,
        userId: isUser === null || isUser === void 0 ? void 0 : isUser._id,
        profileUrl
    });
}));
exports.ResetPasswordReqController = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const isUser = yield authShema_1.default.findOne({ email });
    if (!isUser) {
        return next(new GlobalError_1.default('user does not exist', 400));
    }
    // token generating
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 2 * 60 * 1000);
    isUser.resetCode = code;
    isUser.resetCodeExpiry = expiryTime;
    yield isUser.save();
    // send code to email
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: 'janshi1520@gmail.com',
            pass: 'dqsppgqrikjkgmgz'
        }
    });
    yield transporter.sendMail({
        to: email,
        subject: 'Your Reset Code',
        text: `Your reset code is ${code}`
    });
    // response request
    res.status(200).json({
        status: true,
        email: isUser.email
    });
}));
exports.ResetEmailCodeVerifyController = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = req.body;
    const isUser = yield authShema_1.default.findOne({ email });
    if (!email || !code) {
        return next(new GlobalError_1.default('Required valid data', 500));
    }
    ;
    // here nexted if conditions applied
    if (isUser) {
        if (isUser.resetCode && isUser.resetCodeExpiry) {
            if (isUser.resetCode == code && isUser.resetCodeExpiry > new Date(Date.now())) {
                const token = isUser.get_jwt_token();
                isUser.resetCodeExpiry = null;
                isUser.resetCode = token;
                yield isUser.save();
                res.status(200).json({ token, email: isUser.email, status: true });
            }
            else {
                return next(new GlobalError_1.default('not valid or expired code', 500));
            }
        }
        else {
            return next(new GlobalError_1.default('User did not give proper reset permission', 500));
        }
    }
    else {
        return next(new GlobalError_1.default('User does not exist', 400));
    }
}));
exports.ResetPasswordController = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, confirmPassword, email, token } = req.body;
    // check that there is all required inputs
    if (!password && !confirmPassword && !email && !token) {
        return next(new GlobalError_1.default('Invalid request data', 400));
    }
    // check it is valid token
    const isValidToken = jsonwebtoken_1.default.verify(token, (0, getEnv_1.default)('JWT_SECRET_KEY'));
    const userId = JSON.parse(JSON.stringify(isValidToken));
    if (userId.id) {
        const isUser = yield authShema_1.default.findById(userId.id);
        if (isUser) {
            // send success response to clinets
            isUser.password = password;
            yield (isUser === null || isUser === void 0 ? void 0 : isUser.save());
            res.status(200).json({
                status: true,
                msg: 'Password successfully updated you can login'
            });
        }
        else {
            return next(new GlobalError_1.default('User does not exist', 500));
        }
    }
    else {
        return next(new GlobalError_1.default('Invalid authentication', 500));
    }
}));
