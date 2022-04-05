"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/register", (req, res) => {
    res.send("User Router");
});
exports.default = router;
