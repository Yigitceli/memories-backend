import { Router } from "express";
import { POST_MEMORY } from "../controllers/memoryControllers";


const router: Router = Router();

router.post("/", POST_MEMORY)


export default router;
