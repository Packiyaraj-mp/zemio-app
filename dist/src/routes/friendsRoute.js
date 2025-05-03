"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const friendsController_1 = require("../controllers/friendsController");
const Authenticate_1 = require("../middileWare/Authenticate");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.route('/search').get(Authenticate_1.authenticateMiddle, friendsController_1.FriendsSearchController);
router.route('/frdRequest').get(Authenticate_1.authenticateMiddle, friendsController_1.FriendReqController);
router.route('/getFrdRequest').get(Authenticate_1.authenticateMiddle, friendsController_1.FriendReqGetController);
router.route('/acceptFrdReq').post(Authenticate_1.authenticateMiddle, friendsController_1.FriendReqAcceptController);
router.route('/getFriends').get(Authenticate_1.authenticateMiddle, friendsController_1.FriendsGetController);
exports.default = router;
