"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST_MEMORY = void 0;
const POST_MEMORY = (req, res) => {
    try {
        console.log(req.body);
        res.send("TEST");
    }
    catch (error) { }
};
exports.POST_MEMORY = POST_MEMORY;
