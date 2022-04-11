"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const memoryControllers_1 = require("../controllers/memoryControllers");
const router = (0, express_1.Router)();
router.post("/", memoryControllers_1.POST_MEMORY);
exports.default = router;
