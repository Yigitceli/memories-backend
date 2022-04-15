import { Schema, model } from "mongoose";
import { IMemory } from "../types";

const memorySchema = new Schema<IMemory>({
  author: { required: true, type: Map },
  createdAt: { default: new Date(), type: Date },
  tags: Array,
  comments: Array,
  memoryPhotoUrl: String,
  memoryTitle: String,
  memoryMessage: String,
});

const Memory = model<IMemory>("Memory", memorySchema);
export default Memory;
