import { Router } from "express";
import userRouter from "./user";
import memoryRouter from "./memory"

const router: Router = Router();

router.use("/user", userRouter);
router.use("/memory", memoryRouter)



export default router;
