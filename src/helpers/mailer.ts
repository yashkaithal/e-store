import nodemailer from "nodemailer"
import bcryptjs from "bcryptjs"
import User from "@/models/userModel"

export async function sendEmail({email, emailType, userId}: any) {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if(emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now()+3600000
            })
        }       
        else if(emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now()+3600000
            })
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.MAILTRAP_USER,
              pass: process.env.MAILTRAP_PASS
            }
          });

        const mailOpt = {
            from: "john@example.com",
            to: email,
            subject: 
                emailType === "VERIFY"?"Verify your email":"Reset your password",
            html:
                emailType === "VERIFY"
                ? `<p>Click <a href="${process.env.domain}/verifyemail?token=${hashedToken}">Here</a> to verify your email or copy and paste the link below in your browser. <br/> ${process.env.domain}/verifyemail?token=${hashedToken}</p>`

                : `<p>Click <a href="${process.env.domain}/resetpassword?token=${hashedToken}">here</a> to verify your email or copy and paste the link below in your browser. <br/> ${process.env.domain}/resetpassword?token=${hashedToken}</p>`
        }

        const mailResponse = await transport.sendMail(mailOpt)

        return mailResponse

    } catch (error: any) {
        throw new Error(error.message)
    }
} 