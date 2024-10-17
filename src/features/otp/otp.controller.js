import OtpRepository from "./otp.repository.js";
import bcrypt from "bcrypt";
import randomToken from "random-token";
import ApplicationError from "../../middleware/applicationError.js";

let token;

class OtpController {
    constructor() {
        this.otpRepository = new OtpRepository();
    }

    async sendMail(req, res, next) {
        try {
            const userId = req.userId;
            const resp = await this.otpRepository.sendMailRepo(userId);
            if (resp.success) {
                res.status(201).json({ res: resp.res });
            } else {
                next(new ApplicationError( resp.error.msg,resp.error.statusCode));
            }
        } catch (error) {
            next(new ApplicationError("Something went wrong in sending mail", 500));
        }
    }

    async verifyOtp(req, res, next) {
        try {
            const userId = req.userId;
            const { otp } = req.body;
            const resp = await this.otpRepository.verifyOtpRepo(userId, otp);
            if (resp.success) {
                token = randomToken(16);
                res.cookie("tokenForOTP", token, {
                    maxAge: 10 * 60 * 1000,
                    httpOnly: true,
                }).status(201).json({
                    res: resp.res,
                    token,
                });
            } else {
                next(new ApplicationError( resp.error.msg, resp.error.statusCode));
            }
        } catch (error) {
            next(new ApplicationError( "OTP verification failed" ,500));
        }
    }

    async resetPassword(req, res, next) {
        try {
            if (req.cookies.tokenForOTP === token) {
                let { password } = req.body;
                let userId = req.userId;
                password = await bcrypt.hash(password, 12);
                const resp = await this.otpRepository.resetPasswordRepo(userId, password);
                if (resp.success) {
                    res.clearCookie("jwtToken");
                    res.status(201).json({ success: true, res: resp.res });
                } else {
                    next(new ApplicationError( resp.error.msg ,resp.error.statusCode));
                }
            } else {
                res.status(400).json({ msg: "Unable to update password. Token expired" });
            }
        } catch (error) {
            next(new ApplicationError("Password reset failed" , 500));
        }
    }
}

export default OtpController;
