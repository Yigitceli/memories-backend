import { Router } from "express";
import { LOGIN, REFRESH_TOKEN, REGISTER } from "../controllers/userControllers";
import { User } from "../models/user";
import { IUser } from "../types";

const router: Router = Router();

router.post("/login", LOGIN);
router.post("/register", REGISTER);
router.post("/refresh-token", REFRESH_TOKEN)

export default router;
