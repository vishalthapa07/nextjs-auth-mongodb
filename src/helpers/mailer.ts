import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import { MailtrapTransport } from "mailtrap";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!

    const TOKEN = "661068d2371330d3de08a190b45b4bbb";

    const transport = nodemailer.createTransport(
      MailtrapTransport({
        token: TOKEN,
        testInboxId: 3361527,
      })
    );

    const sender = {
      address: "vishal@vishal.ai",
      name: "Vishal AI",
    };

    const mailOptions = {
      from: sender,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy and paste the link below in your browser.
       <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
      sandbox: true,
    };

    // sending mail in mailtrap for testing

    const mailResponse = await transport
      .sendMail(mailOptions)
      .then(console.log, console.error);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
