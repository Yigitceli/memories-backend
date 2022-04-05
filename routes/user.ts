import { Router } from "express";

const router: Router = Router();

router.post("/register", (req, res) => {
  res.send("User Router");
});

export default router;
