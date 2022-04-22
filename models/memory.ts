import { Schema, model } from "mongoose";
import { IMemory } from "../types";

const memorySchema = new Schema({
  author: { required: true, type: Map },
  tags: Array,
  comments: Array,
  memoryPhotoUrl: String,
  memoryTitle: String,
  memoryMessage: String,
  like: { default: [], type: Array },
});

memorySchema.set("timestamps", true);

const Memory = model<IMemory>("Memory", memorySchema);

export default Memory;
