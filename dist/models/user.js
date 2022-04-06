"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    displayName: { required: true, type: String },
    email: { required: true, type: String },
    password: String,
    authType: { required: true, type: String },
    photoUrl: String,
    userId: String,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
