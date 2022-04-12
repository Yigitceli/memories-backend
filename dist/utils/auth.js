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
exports.AUTH = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const firebaseIn_t_1 = require("../firebaseIn\u0131t");
const AUTH = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authType = req.headers.authtype;
        const accessToken = req.headers.authorization;
        if (accessToken) {
            if (authType == "custom") {
                try {
                    const { user } = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_SECRET);
                    req.user = user;
                    next();
                }
                catch (error) {
                    return res.status(401).json({ msg: "Unauthorized Token" });
                }
            }
            else {
                try {
                    const user = yield firebaseIn_t_1.fireBaseAuth.verifyIdToken(accessToken);
                    const googleUser = {
                        authType: "google",
                        displayName: user.name,
                        email: user.email,
                        photoUrl: user.picture,
                        userId: user.uid,
                    };
                    req.user = googleUser;
                    next();
                }
                catch (error) {
                    return res.status(401).json({ msg: "Unauthorized Token" });
                }
            }
        }
        else {
            return res.status(401).json({ msg: "Missing Token" });
        }
    }
    catch (error) { }
});
exports.AUTH = AUTH;
