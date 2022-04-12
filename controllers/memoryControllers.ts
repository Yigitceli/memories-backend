import { Request, Response } from "express";
export const POST_MEMORY = (req: Request, res: Response) => {
  try {
    console.log(req.body);
    res.send("TEST")
  } catch (error) {}
};
