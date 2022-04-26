import { Router } from "express";
import {
  COMMENT,
  DELETE_MEMORY,
  GET_MEMORIES,
  GET_MEMORY,
  LIKE,
  POST_MEMORY,
} from "../controllers/memoryControllers";
import { AUTH } from "../utils/auth";

const router: Router = Router();

router.post("/", AUTH, POST_MEMORY);
router.get("/", GET_MEMORIES);
router.get("/:id", GET_MEMORY);
router.post("/:id/comment", AUTH, COMMENT);
router.put("/:id/like", AUTH, LIKE)
router.delete("/:id", AUTH, DELETE_MEMORY);

export default router;
