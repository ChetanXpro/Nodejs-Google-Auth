import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: String,
  photo: String,
  goggleId: {
    type: String,
    require: true,
    unique: true,
  },
  role: {
    type: "String",
    enum: ["admin", "user"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const User = mongoose.model("User", schema);
