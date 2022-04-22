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
exports.COMMENT = exports.GET_MEMORY = exports.GET_MEMORIES = exports.POST_MEMORY = void 0;
const mongoose_1 = require("mongoose");
const memory_1 = __importDefault(require("../models/memory"));
const POST_MEMORY = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const memoryData = req.body;
    const { tags, memoryMessage, memoryPhotoUrl, memoryTitle } = memoryData;
    if (!tags ||
        tags.length <= 0 ||
        !memoryMessage ||
        !memoryPhotoUrl ||
        !memoryTitle)
        return res.status(406).json({ msg: "Missing Inputs" });
    try {
        const MemoryAuthor = {
            displayName: user.displayName,
            email: user.email,
            photoUrl: user.photoUrl,
            userId: user.userId,
        };
        const MemoryTemplate = {
            author: MemoryAuthor,
            comments: [],
            memoryMessage: memoryData.memoryMessage,
            memoryPhotoUrl: memoryData.memoryPhotoUrl,
            memoryTitle: memoryData.memoryTitle,
            tags: memoryData.tags,
            like: [],
        };
        const newMemory = new memory_1.default(MemoryTemplate);
        yield newMemory.save();
        return res
            .status(200)
            .json({ msg: "Memory has been created.", payload: newMemory });
    }
    catch (error) {
        return res.status(500).json({ msg: "Something gone wrong!" });
    }
});
exports.POST_MEMORY = POST_MEMORY;
const GET_MEMORIES = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    try {
        const memories = yield memory_1.default.find()
            .sort({ createdAt: -1 })
            .skip(parseInt(page) * parseInt(limit))
            .limit(parseInt(limit));
        if (memories.length <= 0)
            return res.status(404).json({ msg: "There is no more memories!" });
        return res.json({ msg: "Memories Fetched!", payload: memories });
    }
    catch (error) {
        return res.status(500).json({ msg: "Something gone wrong!" });
    }
});
exports.GET_MEMORIES = GET_MEMORIES;
const GET_MEMORY = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const memoryAggregate = yield memory_1.default.aggregate([
            { $match: { _id: new mongoose_1.Types.ObjectId(id) } },
            {
                $addFields: {
                    comments: { $reverseArray: "$comments" },
                },
            },
        ]);
        if (memoryAggregate.length > 0) {
            const memory = memoryAggregate[0];
            return res
                .status(200)
                .json({ msg: "Memory Successfully found!", payload: memory });
        }
        else {
            return res.status(404).json({ msg: "Memory can't be found!" });
        }
    }
    catch (error) {
        return res.status(500).json({ msg: "Something gone wrong!" });
    }
});
exports.GET_MEMORY = GET_MEMORY;
const COMMENT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { comment } = req.body;
    const user = req.user;
    try {
        const commentData = {
            comment,
            displayName: user === null || user === void 0 ? void 0 : user.displayName,
            email: user === null || user === void 0 ? void 0 : user.email,
            photoUrl: user === null || user === void 0 ? void 0 : user.photoUrl,
            userId: user === null || user === void 0 ? void 0 : user.userId,
        };
        const memory = yield memory_1.default.findByIdAndUpdate(id, {
            $push: {
                comments: commentData,
            },
        });
        return res.status(200).json({ msg: "Comment send!" });
    }
    catch (error) {
        return res.status(500).json({ msg: "Something gone wrong!" });
    }
});
exports.COMMENT = COMMENT;
