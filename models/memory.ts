import { Schema, model } from "mongoose";
import { IMemory } from "../types";

const memorySchema = new Schema<IMemory>({
  author: { required: true, type: Map },
  createdAt: new Date(),
  tags: Array,
  comments: Array,
  memoryPhotoUrl: String,
  memoryTitle: String,
  memoryMessage: String,
});

const Memory = model<IMemory>("Memory", memorySchema);
export default Memory;
