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
exports.LIKE = exports.DELETE_MEMORY = exports.COMMENT = exports.GET_MEMORY = exports.GET_MEMORIES = exports.POST_MEMORY = void 0;
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
    const { page, limit, search } = req.query;
    try {
        if (search) {
            const searchValue = search;
            let searchTags = [];
            if (typeof search == "string") {
                searchTags = search.split(" ");
            }
            const memories = yield memory_1.default.find({
                $or: [
                    { $text: { $search: searchValue } },
                    { tags: { $in: searchTags } },
                ],
            })
                .sort({ createdAt: -1 })
                .skip(parseInt(page) * parseInt(limit))
                .limit(parseInt(limit));
            if (memories.length <= 0)
                return res.status(404).json({ msg: "There is no more memories!" });
            return res.json({ msg: "Memories Fetched!", payload: memories });
        }
        else {
            const memories = yield memory_1.default.find()
                .sort({ createdAt: -1 })
                .skip(parseInt(page) * parseInt(limit))
                .limit(parseInt(limit));
            if (memories.length <= 0)
                return res.status(404).json({ msg: "There is no more memories!" });
            return res.json({ msg: "Memories Fetched!", payload: memories });
        }
    }
    catch (error) {
        console.log(error);
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
            const likeMemories = yield memory_1.default.find({
                $and: [{ tags: { $all: memory.tags } }, { _id: { $ne: memory._id } }],
            }).limit(3);
            return res.status(200).json({
                msg: "Memory Successfully found!",
                payload: Object.assign(Object.assign({}, memory), { likeMemories }),
            });
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
const DELETE_MEMORY = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    try {
        const memory = yield memory_1.default.findOne({ _id: id });
        const author = memory === null || memory === void 0 ? void 0 : memory.author;
        if (!memory)
            return res.status(404).json({ msg: "Memory with this id is not exist!" });
        if (memory.author.userId !== user.userId) {
            return res.status(406).json({ msg: "UserId is not true!" });
        }
        yield memory_1.default.findByIdAndDelete(id);
        return res.status(200).json({ msg: "Memory deleted." });
    }
    catch (error) {
        return res.status(500).json({ msg: "Something gone wrong!" });
    }
});
exports.DELETE_MEMORY = DELETE_MEMORY;
const LIKE = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const likeUser = {
        userId: user.userId,
        displayName: user.displayName,
        email: user.email,
        photoUrl: user.photoUrl,
    };
    try {
        const memory = yield memory_1.default.findOne({ _id: id });
        if (!memory)
            return res.status(404).json({ msg: "Memory with this id is not exist!" });
        if (memory.like.find((author) => author.userId == likeUser.userId)) {
            const newMemory = yield memory_1.default.findByIdAndUpdate(id, { $pull: { like: { userId: likeUser.userId } } }, { new: true });
            return res
                .status(200)
                .json({ msg: "Memory unliked", payload: newMemory });
        }
        else {
            const newMemory = yield memory_1.default.findByIdAndUpdate(id, {
                $push: { like: likeUser },
            }, { new: true });
            return res.status(200).json({ msg: "Memory liked", payload: newMemory });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Something gone wrong!" });
    }
});
exports.LIKE = LIKE;
