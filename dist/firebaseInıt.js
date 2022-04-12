"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fireBaseAuth = void 0;
const firebase_admin_1 = require("firebase-admin");
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const firebase_servs_json_1 = __importDefault(require("./firebase-servs.json"));
const app = (0, app_1.initializeApp)({
    credential: firebase_admin_1.credential.cert(firebase_servs_json_1.default),
});
exports.fireBaseAuth = (0, auth_1.getAuth)(app);
