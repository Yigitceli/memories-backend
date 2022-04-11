"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const memorySchema = new mongoose_1.Schema({
    author: { required: true, type: Map },
    createdAt: new Date(),
    tags: Array,
    comments: Array,
    memoryPhotoUrl: String,
    memoryTitle: String,
    memoryMessage: String,
});
const Memory = (0, mongoose_1.model)("Memory", memorySchema);
exports.default = Memory;
