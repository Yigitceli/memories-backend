import { Router } from "express";
import { LOGIN, PROFIL_PHOTO, REFRESH_TOKEN, REGISTER } from "../controllers/userControllers";
import { User } from "../models/user";
import { IUser } from "../types";
import { AUTH } from "../utils/auth";

const router: Router = Router();

router.post("/login", LOGIN);
router.post("/register", REGISTER);
router.post("/refresh-token", REFRESH_TOKEN)
router.put("/profil-photo", AUTH, PROFIL_PHOTO)

export default router;
