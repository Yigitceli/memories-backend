import { Router } from "express";
import { COMMENT, GET_MEMORIES, GET_MEMORY, POST_MEMORY } from "../controllers/memoryControllers";
import { AUTH } from "../utils/auth";


const router: Router = Router();

router.post("/", AUTH, POST_MEMORY)
router.get("/", GET_MEMORIES)
router.get("/:id", GET_MEMORY)
router.post("/:id/comment", AUTH, COMMENT)


export default router;
