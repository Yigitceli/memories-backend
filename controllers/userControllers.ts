import { ICustomLoginBody, IRegisterBody, IUser } from "../types";
import { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import { uid } from "uid";
import jwt from "jsonwebtoken";

export const LOGIN = async (req: Request, res: Response) => {
  const { authType } = req.query;

  try {
    if (authType === "google") {
      const { userData }: { userData: IUser } = req.body;
      const user: IUser | null = await User.findOne({
        email: userData.email,
      });

      if (user && user.authType == "google")
        return res.status(200).json({ msg: "User Logged In!", payload: user });
      if (user && user.authType == "custom")
        return res
          .status(401)
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
        return res.status(401).json({ msg: "Missing Inputs" });
      }
    } else {
      const { userData }: { userData: ICustomLoginBody } = req.body;
      let user: IUser | null = await User.findOne({
        email: userData.email,
        authType: "custom",
      });

      if (!user) return res.status(401).json({ msg: "User does not exist!" });
      const passwordCheck = await bcrypt.compare(
        userData.password,
        user.password!
      );
      if (!passwordCheck)
        return res.status(401).json({ msg: "Wrong Password" });

      user = user._doc;
      let { password, ...UserData } = user as IUser;
     
      const accessToken = jwt.sign(UserData, process.env.ACCESS_SECRET, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(UserData, process.env.REFRESH_SECRET, {
        expiresIn: "365days",
      });

      return res.status(200).json({
        msg: "User successfully logged in!",
        payload: { UserData: UserData, accessToken, refreshToken },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something gone wrong!" });
  }
};

export const REGISTER = async (req: Request, res: Response) => {
  const { email, displayName, authType, password }: IRegisterBody = req.body;
  try {
    const userCheck = await User.findOne({ email });
    if (userCheck)
      return res.status(406).json({ msg: "Email is already used!" });
    const cryptedPassword = await bcrypt.hash(password, 10);
    const user = new User<IUser>({
      email,
      displayName,
      authType,
      password: cryptedPassword,
      userId: uid(32),
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/memories-cbddb.appspot.com/o/sbcf-default-avatar.png?alt=media&token=a54e6178-34ee-4ae5-a45b-65766c9b3578",
    });
    await user.save();

    return res
      .status(201)
      .json({ msg: "Successfully Registered!", payload: user });
  } catch (error) {
    return res.status(500).json({ msg: "Something gone wrong!" });
  }
};