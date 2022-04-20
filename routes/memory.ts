import { Router } from "express";
import { GET_MEMORIES, POST_MEMORY } from "../controllers/memoryControllers";
import { AUTH } from "../utils/auth";


const router: Router = Router();

router.post("/", AUTH, POST_MEMORY)
router.get("/", GET_MEMORIES)


export default router;
