import { Request, Response } from "express";
import { Types } from "mongoose";
import Memory from "../models/memory";
import { IComment, IMemory, IMemoryAuthor } from "../types";

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
      like: [],
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

export const GET_MEMORIES = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  try {
    const memories: IMemory[] = await Memory.find()
      .sort({ createdAt: -1 })
      .skip(parseInt(page as string) * parseInt(limit as string))
      .limit(parseInt(limit as string));

    if (memories.length <= 0)
      return res.status(404).json({ msg: "There is no more memories!" });

    return res.json({ msg: "Memories Fetched!", payload: memories });
  } catch (error) {
    return res.status(500).json({ msg: "Something gone wrong!" });
  }
};

export const GET_MEMORY = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const memoryAggregate = await Memory.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $addFields: {
          comments: { $reverseArray: "$comments" },
        },
      },
    ]);

    if (memoryAggregate.length > 0) {
      const memory: IMemory = memoryAggregate[0];
      const likeMemories = await Memory.find({
        $and: [{ tags: { $all: memory.tags } }, { _id: { $ne: memory._id } }],
      }).limit(3);    
      return res
        .status(200)
        .json({
          msg: "Memory Successfully found!",
          payload: { ...memory, likeMemories },
        });
    } else {
      return res.status(404).json({ msg: "Memory can't be found!" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Something gone wrong!" });
  }
};

export const COMMENT = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { comment } = req.body;
  const user = req.user;
  try {
    const commentData: IComment = {
      comment,
      displayName: user?.displayName as string,
      email: user?.email as string,
      photoUrl: user?.photoUrl as string,
      userId: user?.userId as string,
    };
    const memory: IMemory | null = await Memory.findByIdAndUpdate(id, {
      $push: {
        comments: commentData,
      },
    });

    return res.status(200).json({ msg: "Comment send!" });
  } catch (error) {
    return res.status(500).json({ msg: "Something gone wrong!" });
  }
};
