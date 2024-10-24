import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/miniproject");

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  age: Number,
  password: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

export default mongoose.model("user", userSchema);
