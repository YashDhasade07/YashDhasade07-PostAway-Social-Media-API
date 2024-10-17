import mongoose from "mongoose"

export const postSchema = mongoose.Schema({
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
     caption: {type: String, required: true },
     imageUrl: {type: String, required: true },
})


