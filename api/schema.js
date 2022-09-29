import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  user: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
  },
  changes: {
    type: Number,
  },
});

const Users = model("Users", userSchema);

export { Users };
