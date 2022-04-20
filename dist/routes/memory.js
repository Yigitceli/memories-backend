"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const memoryControllers_1 = require("../controllers/memoryControllers");
const auth_1 = require("../utils/auth");
const router = (0, express_1.Router)();
router.post("/", auth_1.AUTH, memoryControllers_1.POST_MEMORY);
router.get("/", memoryControllers_1.GET_MEMORIES);
exports.default = router;
