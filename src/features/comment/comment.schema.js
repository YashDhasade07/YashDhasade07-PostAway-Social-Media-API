import mongoose from "mongoose"

export const commentSchema = mongoose.Schema({
     
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    content: {
        type: String , required: true
    }
})