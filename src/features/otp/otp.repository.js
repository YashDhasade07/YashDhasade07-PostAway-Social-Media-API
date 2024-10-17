import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";
import { userSchema } from "../user/user.schema.js";
import { otpSchema } from "./otp.schema.js";

const UserModel = mongoose.model("User", userSchema);
const OtpModel = mongoose.model("Otp", otpSchema);
const otp = Math.floor(100000 + Math.random() * 900000);

class OtpRepository {
    async sendMailRepo(userId) {
        try {
            const foundUser = await UserModel.findById({ _id: new ObjectId(userId) });
            const newOtp = await new OtpModel({ user: userId, otp }).save();

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "yashdhasade01@gmail.com",
                    pass: "xkdrqvrznntsjues",
                },
            });

            const mailOptions = {
                from: "yashdhasade01@gmail.com",
                to: foundUser.email,
                subject: "OTP for Email Verification",
                text: `Enter this OTP to change the password - ${otp}.`,
            };

            await transporter.sendMail(mailOptions);
            return { success: true, res: "Email sent successfully" };
        } catch (error) {
            console.error(error);
            return { success: false, error: { statusCode: 400, msg: error } };
        }
    }

    async verifyOtpRepo(userId, otp) {
        try {
            const foundOtp = await OtpModel.aggregate([
                { $group: { _id: userId, otp: { $last: "$otp" } } },
            ]);

            if (foundOtp[0].otp === otp) {
                return { success: true, res: "OTP matched successfully" };
            }
            return { error: { statusCode: 400, msg: "OTP expired" } };
        } catch (error) {
            console.error(error);
            return { success: false, error: { statusCode: 400, msg: error } };
        }
    }

    async resetPasswordRepo(userId, changedPassword) {
        try {
            const foundUser = await UserModel.findById({ _id: userId });
            if (foundUser) {
                await UserModel.updateOne({ _id: userId }, { password: changedPassword });
                return { success: true, res: "Password updated" };
            } else {
                return { success: false, error: "User not found" };
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: { statusCode: 400, msg: error } };
        }
    }
}

export default OtpRepository;
