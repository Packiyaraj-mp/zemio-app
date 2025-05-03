"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const getEnv_1 = __importDefault(require("../config/getEnv"));
const dbConnection_1 = __importDefault(require("./models/dbConnection"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const agora_access_token_1 = require("agora-access-token");
const router = express_1.default.Router();
const APP_ID = '8b0c9815fabf4258be88e952848727f2';
const APP_CERTIFICATE = 'c4311d144e1e4e6fb72d2550862216eb';
// env variables
const port = (0, getEnv_1.default)('PORT');
;
const joinedUsers = {};
const server = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
app_1.default.post('/rtcToken', (req, res, next) => {
    const { channelName, accountUser } = req.body;
    console.log(accountUser);
    if (!channelName || accountUser == null) {
        res.status(400).json({
            msg: 'require Info'
        });
        return;
    }
    ;
    const role = agora_access_token_1.RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const token = agora_access_token_1.RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, accountUser, role, privilegeExpiredTs);
    res.json({ token });
});
io.on('connection', (socket) => {
    // register user
    socket.on('register', (id) => {
        joinedUsers[id] = socket.id;
        console.log(`${id} successfully registered`);
    });
    socket.on('call-user', ({ sender, from, to, channelName }) => {
        const targetUser = joinedUsers[to];
        if (targetUser) {
            io.to(targetUser).emit('incoming-call', { sender, from, channelName });
        }
    });
});
server.listen(port, () => {
    console.log(`server is running on port number is ${port}`);
    (0, dbConnection_1.default)();
});
