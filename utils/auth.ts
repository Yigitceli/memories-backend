import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { fireBaseAuth } from "../firebaseInıt";
import { IUser } from "../types";

export const AUTH = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authType = req.headers.authtype;
    const accessToken = req.headers.authorization;   
    if (accessToken) {
      if (authType == "custom") {
        try {
          const { user } = jwt.verify(
            accessToken,
            process.env.ACCESS_SECRET
          ) as {
            user: IUser;
          };
          req.user = user;
          next();
        } catch (error) {
          return res.status(401).json({ msg: "Unauthorized Token" });
        }
      } else {
        try {
          const user = await fireBaseAuth.verifyIdToken(accessToken);

          const googleUser: IUser = {
            authType: "google",
            displayName: user.name,
            email: user.email!,
            photoUrl: user.picture!,
            userId: user.uid,
          };
          req.user = googleUser;

          next();
        } catch (error) {         
          return res.status(401).json({ msg: "Unauthorized Token" });
        }
      }
    } else {
      return res.status(401).json({ msg: "Missing Token" });
    }
  } catch (error) {}
};
