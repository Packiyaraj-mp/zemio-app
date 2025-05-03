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
exports.FriendsGetController = exports.FriendReqAcceptController = exports.FriendReqGetController = exports.FriendReqController = exports.FriendsSearchController = void 0;
const AsyncHandler_1 = require("../middileWare/AsyncHandler");
const authShema_1 = __importDefault(require("../models/ModelShema/authShema"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const getEnv_1 = __importDefault(require("../../config/getEnv"));
const friendsRequestSchema_1 = __importDefault(require("../models/ModelShema/friendsRequestSchema"));
const GlobalError_1 = __importDefault(require("../utils/GlobalError"));
const friendsShema_1 = __importDefault(require("../models/ModelShema/friendsShema"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: (0, getEnv_1.default)('AWS_ACCESS_KEY'),
    secretAccessKey: (0, getEnv_1.default)('AWS_SECRET_KEY'),
    region: 'us-east-1'
});
const getAWSsignedUrl = (fileKey) => __awaiter(void 0, void 0, void 0, function* () {
    const signedUrl = s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Expires: 300
    });
    if (signedUrl) {
        return signedUrl;
    }
});
exports.FriendsSearchController = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, text } = req.query;
    console.log(page);
    const { email, id } = req.user;
    const limit = 8;
    let skip = (Number(page) - 1) * limit;
    const users = yield authShema_1.default.find({ name: { $regex: text, $options: 'i' }, _id: { $ne: id } }).skip(skip).limit(limit).select('name _id email profileUrl').lean();
    const userId = users.map(doc => String(doc._id));
    const isReq = yield friendsRequestSchema_1.default.find({ $or: [{ sender: id, receiver: { $in: userId } }, { receiver: id, sender: userId }] }).lean();
    const resData = yield Promise.all(users.map((data) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            name: data.name,
            email: data.email,
            userId: data._id,
            profileUrl: data.profileUrl
                ? yield getAWSsignedUrl(data.profileUrl)
                : null,
            status: isReq.map(user => {
                if (String(user.sender) == String(data._id) || String(user.receiver) == String(data._id)) {
                    return user.status;
                }
            }).join("") || 'not'
        });
    })));
    res.status(200).json({
        friends: resData
    });
}));
exports.FriendReqController = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.query;
    const { id, email } = req.user;
    if (id == email) {
        return next(new GlobalError_1.default('you cannot send request yourself', 400));
    }
    const isReq = yield friendsRequestSchema_1.default.findOne({ $or: [{ sender: id, receiver: data }, { receiver: id, sender: data }] });
    if (isReq) {
        return next(new GlobalError_1.default('already exist request', 400));
    }
    const newUser = new friendsRequestSchema_1.default({
        sender: id,
        receiver: data
    });
    yield newUser.save();
    res.status(200).json({
        senderId: data
    });
}));
exports.FriendReqGetController = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, email } = req.user;
    const { page } = req.query;
    const frdReqList = yield friendsRequestSchema_1.default.find({ receiver: id, status: { $ne: 'accepted' } }).populate({ path: 'sender', select: '-password' });
    const requestList = yield Promise.all(frdReqList.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            name: user.sender.name,
            docId: user._id,
            senderId: user.sender._id,
            profileUrl: user.sender.profileUrl ? yield getAWSsignedUrl(user.sender.profileUrl) : null
        };
    })));
    res.status(200).json({
        requestList
    });
}));
exports.FriendReqAcceptController = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sender, docId } = req.body;
    const { id, email } = req.user;
    const isFriends = yield friendsShema_1.default.findOne({ user: id });
    const isSenderFrds = yield friendsShema_1.default.findOne({ user: sender });
    if (isFriends == null) {
        const friendsList = yield friendsShema_1.default.create({
            user: id,
            friendsList: [sender]
        });
        yield friendsRequestSchema_1.default.updateOne({ $or: [{ sender: id, receiver: sender }, { receiver: id, sender: sender }] }, { $set: { status: 'accepted' } });
    }
    else {
        const updateSuccess = yield friendsShema_1.default.updateOne({ user: id, friendsList: { $nin: sender } }, { $push: { friendsList: sender } });
        if (!updateSuccess) {
            return next(new GlobalError_1.default('not proper data', 400));
        }
        yield friendsRequestSchema_1.default.updateOne({ $or: [{ sender: id, receiver: sender }, { receiver: id, sender: sender }] }, { $set: { status: 'accepted' } });
    }
    ;
    if (isSenderFrds == null) {
        yield friendsShema_1.default.create({
            user: sender,
            friendsList: [id]
        });
    }
    else {
        const updateSuccess = yield friendsShema_1.default.updateOne({ user: sender, friendsList: { $nin: id } }, { $push: { friendsList: id } });
        if (!updateSuccess) {
            return next(new GlobalError_1.default('not proper data', 400));
        }
        yield friendsRequestSchema_1.default.updateOne({ $or: [{ sender: id, receiver: sender }, { receiver: id, sender: sender }] }, { $set: { status: 'accepted' } });
    }
    ;
    res.status(200).json({
        docId
    });
}));
exports.FriendsGetController = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, email } = req.user;
    const frds = yield friendsShema_1.default.findOne({ user: id }).populate({
        path: 'friendsList',
        options: { limit: 10 }
    }).lean();
    if (!frds) {
        return next(new GlobalError_1.default('no friends', 400));
    }
    const data = yield Promise.all(((frds === null || frds === void 0 ? void 0 : frds.friendsList) || []).map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const url = (item === null || item === void 0 ? void 0 : item.profileUrl) ? yield getAWSsignedUrl(item.profileUrl) : null;
        return { profileUrl: url, name: item.name, userId: item._id };
    })));
    res.status(200).json({
        data
    });
}));
