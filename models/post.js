import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
    ,
    date: {
        type: Date,
        dafault: Date.now
    },
    content: String,
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },]
        
});

export default mongoose.model("post", postSchema);