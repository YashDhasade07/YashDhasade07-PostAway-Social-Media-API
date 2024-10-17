import mongoose from "mongoose"

export const friendshipSchema = mongoose.Schema({
     
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String , required: true , enum:["pending" , "active"]
    }
})