"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const ValidationHandler_1 = require("../middileWare/ValidationHandler");
const ValidateRequest_1 = __importDefault(require("../middileWare/ValidateRequest"));
const Authenticate_1 = require("../middileWare/Authenticate");
const router = express_1.default.Router();
router.route('/register').post(ValidationHandler_1.registerValidation, ValidateRequest_1.default, authController_1.RegisterController);
router.route('/login').post(ValidationHandler_1.loginValidation, ValidateRequest_1.default, authController_1.LoginController);
router.route('/authenticate').get(Authenticate_1.authenticateMiddle, authController_1.AuthenticateController);
router.route('/resetPasswordReq').post(ValidationHandler_1.resetPasswordReqValidation, ValidateRequest_1.default, authController_1.ResetPasswordReqController);
router.route('/resetEmailCodeVerify').post(ValidationHandler_1.resetEmailCodeVerifyValidation, ValidateRequest_1.default, authController_1.ResetEmailCodeVerifyController);
router.route('/resetPassword').post(ValidationHandler_1.resetPasswordValidation, ValidateRequest_1.default, authController_1.ResetPasswordController);
exports.default = router;
