import ApplicationError from "../../middleware/applicationError.js";
import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";

const UserModel = mongoose.model('User', userSchema)
export default class UserRepository {

    async add(name, email, password, gender) {
        try {
            const newUser = new UserModel({ name, email, password, gender });
            const savedUser = await newUser.save()
            return savedUser;
        } catch (error) {
            throw new ApplicationError('Something went wrong while regestration', 400)
        }

    }

    async findByEmail(email) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            throw new ApplicationError('Something went wrong while login', 400)
        }
    }
    async getDetails(userId) {
        try {
            const user = await UserModel.findOne({ _id: userId }).select('name email gender');
            return user;
        } catch (error) {
            throw new ApplicationError('Something went wrong while fetching user details', 400);
        }
    }
    async getAllDetails() {
        try {
            const users = await UserModel.find().select('name email gender');
            return users;
        } catch (error) {
            throw new ApplicationError('Something went wrong while fetching users details', 400);
        }
    }
    async updateDetails(id, name, email, gender) {
        try {
            let user = await UserModel.findById(id);
            user.name = name;
            user.email = email;
            user.gender = gender;
            let savedUser = await user.save();
            let data = {
                name: savedUser.name,
                email: savedUser.email,
                gender: savedUser.gender,
            }
            return data;
        } catch (error) {
            throw new ApplicationError('Something went wrong while updating user details', 400);
        }
    }
}