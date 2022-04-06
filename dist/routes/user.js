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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../models/user");
const router = (0, express_1.Router)();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authType } = req.query;
    const { userData } = req.body;
    try {
        if (authType === "google") {
            const user = yield user_1.User.findOne({
                email: userData.email,
            });
            if (user && user.authType == "google")
                return res.status(200).json({ msg: "User Logged In!", payload: user });
            if (user && user.authType == "custom")
                return res
                    .status(406)
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
                return res.json(204).json({ msg: "User Logged In!", payload: newUser });
            }
            catch (error) {
                return res.status(406).json({ msg: "Missing Inputs" });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ msg: "Something gone wrong!" });
    }
}));
exports.default = router;
