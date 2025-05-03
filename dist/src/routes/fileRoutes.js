"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fileController_1 = require("../controllers/fileController");
const Authenticate_1 = require("../middileWare/Authenticate");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.route('/profileUpload').post(Authenticate_1.authenticateMiddle, upload.single('profile'), fileController_1.uploadProfileController);
exports.default = router;
