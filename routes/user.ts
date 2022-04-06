import { Router } from "express";
import { User } from "../models/user";
import { IUser } from "../types";

const router: Router = Router();

router.post("/login", async (req, res) => {
  const { authType } = req.query;
  const { userData }: { userData: IUser } = req.body;
  try {
    if (authType === "google") {
      const user: IUser | null = await User.findOne({
        email: userData.email,
      });

      if (user && user.authType == "google")
        return res.status(200).json({ msg: "User Logged In!", payload: user });
      if (user && user.authType == "custom")
        return res
          .status(406)
          .json({ msg: "Wrong login platform. This email is already in use" });
      try {
        const newUser = new User<IUser>({
          displayName: userData.displayName,
          email: userData.email,
          photoUrl: userData.photoUrl,
          authType: authType,
          userId: userData.userId,
        });
        await newUser.save();
        return res.json(204).json({ msg: "User Logged In!", payload: newUser });
      } catch (error) {
        return res.status(406).json({ msg: "Missing Inputs" });
      }
    }
  } catch (error) {
    return res.status(500).json({ msg: "Something gone wrong!" });
  }
});

export default router;
