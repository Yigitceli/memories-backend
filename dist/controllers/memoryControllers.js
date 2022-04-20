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
exports.GET_MEMORIES = exports.POST_MEMORY = void 0;
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
    const { page } = req.query;
    try {
        const memories = yield memory_1.default.find()
            .sort({ createdAt: -1 })
            .skip(parseInt(page) * 10)
            .limit(5);
        return res.json({ msg: "Memories Fetched!", payload: memories });
    }
    catch (error) {
        return res.status(500).json({ msg: "Something gone wrong!" });
    }
});
exports.GET_MEMORIES = GET_MEMORIES;
