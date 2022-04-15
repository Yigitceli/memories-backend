import { Request, Response } from "express";
import Memory from "../models/memory";
import { IMemory, IMemoryAuthor } from "../types";

export const POST_MEMORY = async (req: Request, res: Response) => {
  interface IMemoryPost {
    tags: string[];
    memoryMessage: string;
    memoryPhotoUrl: string;
    memoryTitle: string;
  }

  const user = req.user;
  const memoryData: IMemoryPost = req.body;
  const { tags, memoryMessage, memoryPhotoUrl, memoryTitle } = memoryData;
  if (
    !tags ||
    tags.length <= 0 ||
    !memoryMessage ||
    !memoryPhotoUrl ||
    !memoryTitle
  )
    return res.status(406).json({ msg: "Missing Inputs" });
  try {
    const MemoryAuthor: IMemoryAuthor = {
      displayName: user.displayName,
      email: user.email,
      photoUrl: user.photoUrl,
      userId: user.userId,
    };
    const MemoryTemplate: IMemory = {
      author: MemoryAuthor,
      comments: [],      
      memoryMessage: memoryData.memoryMessage,
      memoryPhotoUrl: memoryData.memoryPhotoUrl,
      memoryTitle: memoryData.memoryTitle,
      tags: memoryData.tags,
    };
    const newMemory = new Memory<IMemory>(MemoryTemplate);
    await newMemory.save();
    return res
      .status(200)
      .json({ msg: "Memory has been created.", payload: newMemory });
  } catch (error) {
    return res.status(500).json({ msg: "Something gone wrong!" });
  }
};
