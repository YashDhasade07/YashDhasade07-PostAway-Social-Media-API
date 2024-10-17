import mongoose from "mongoose"

export const userSchema = mongoose.Schema({
    name: { type: String , required: true },
    email: {type: String, required: true },
    password: {type: String, required: true },
    gender: {type: String, enum: ['female' , 'male'] },
    friends:[
        {type: mongoose.Schema.Types.ObjectId,
        ref:'User'}
    ]
})
