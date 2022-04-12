import { Router } from "express";
import { POST_MEMORY } from "../controllers/memoryControllers";
import { AUTH } from "../utils/auth";


const router: Router = Router();

router.post("/", AUTH, POST_MEMORY)


export default router;
