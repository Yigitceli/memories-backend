import { Router } from "express";
import { LOGIN, REGISTER } from "../controllers/userControllers";
import { User } from "../models/user";
import { IUser } from "../types";

const router: Router = Router();

router.post("/login", LOGIN);
router.post("/register", REGISTER);

export default router;
