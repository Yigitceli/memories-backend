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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGISTER = exports.LOGIN = void 0;
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uid_1 = require("uid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const LOGIN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authType } = req.query;
    try {
        const { userData } = req.body;
        if (authType === "google") {
            const user = yield user_1.User.findOne({
                email: userData.email,
            });
            if (user && user.authType == "google")
                return res.status(200).json({ msg: "User Logged In!", payload: user });
            if (user && user.authType == "custom")
                return res
                    .status(401)
                    .json({ msg: "Wrong login platform. This email is already in use" });
            try {
                const newUser = new user_1.User({
                    displayName: userData.displayName,
                    email: userData.email,
                    photoUrl: userData.photoUrl,
                    authType: authType,
                    userId: userData.userId,
                });
                yield newUser.save();
                return res
                    .status(200)
                    .json({ msg: "User logged In!", payload: newUser });
            }
            catch (error) {
                return res.status(401).json({ msg: "Missing Inputs" });
            }
        }
        else {
            const { userData } = req.body;
            let user = yield user_1.User.findOne({
                email: userData.email,
                authType: "custom",
            });
            if (!user)
                return res.status(401).json({ msg: "User does not exist!" });
            const passwordCheck = yield bcrypt_1.default.compare(userData.password, user.password);
            if (!passwordCheck)
                return res.status(401).json({ msg: "Wrong Password" });
            user = user._doc;
            let _a = user, { password } = _a, UserData = __rest(_a, ["password"]);
            const accessToken = jsonwebtoken_1.default.sign(UserData, process.env.ACCESS_SECRET, {
                expiresIn: "1h",
            });
            const refreshToken = jsonwebtoken_1.default.sign(UserData, process.env.REFRESH_SECRET, {
                expiresIn: "365days",
            });
            return res.status(200).json({
                msg: "User successfully logged in!",
                payload: { UserData: UserData, accessToken, refreshToken },
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Something gone wrong!" });
    }
});
exports.LOGIN = LOGIN;
const REGISTER = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, displayName, authType, password } = req.body;
    try {
        const userCheck = yield user_1.User.findOne({ email });
        if (userCheck)
            return res.status(406).json({ msg: "Email is already used!" });
        const cryptedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new user_1.User({
            email,
            displayName,
            authType,
            password: cryptedPassword,
            userId: (0, uid_1.uid)(32),
            photoUrl: "https://firebasestorage.googleapis.com/v0/b/memories-cbddb.appspot.com/o/sbcf-default-avatar.png?alt=media&token=a54e6178-34ee-4ae5-a45b-65766c9b3578",
        });
        yield user.save();
        return res
            .status(201)
            .json({ msg: "Successfully Registered!", payload: user });
    }
    catch (error) {
        return res.status(500).json({ msg: "Something gone wrong!" });
    }
});
exports.REGISTER = REGISTER;
