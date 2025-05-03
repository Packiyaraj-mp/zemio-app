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
exports.uploadProfileController = void 0;
const AsyncHandler_1 = require("../middileWare/AsyncHandler");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const getEnv_1 = __importDefault(require("../../config/getEnv"));
const GlobalError_1 = __importDefault(require("../utils/GlobalError"));
const authShema_1 = __importDefault(require("../models/ModelShema/authShema"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: (0, getEnv_1.default)('AWS_ACCESS_KEY'),
    secretAccessKey: (0, getEnv_1.default)('AWS_SECRET_KEY'),
    region: 'us-east-1'
});
exports.uploadProfileController = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const { email, id } = req.user;
    if (!file) {
        return next(new GlobalError_1.default('file is empty', 400));
    }
    const fileKey = `profile-pics/${Date.now()}_${file === null || file === void 0 ? void 0 : file.originalname}`;
    const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: file === null || file === void 0 ? void 0 : file.buffer,
        ContentType: file === null || file === void 0 ? void 0 : file.mimetype,
        ACL: 'private'
    };
    yield s3.upload(uploadParams).promise();
    const signedUrl = s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Expires: 300
    });
    yield authShema_1.default.findOneAndUpdate({ email }, { $set: { profileUrl: fileKey } });
    res.status(200).json({
        profileUrl: signedUrl,
        status: true
    });
}));
