"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const router = (0, express_1.Router)();
router.post("/login", userControllers_1.LOGIN);
router.post("/register", userControllers_1.REGISTER);
router.post("/refresh-token", userControllers_1.REFRESH_TOKEN);
exports.default = router;
