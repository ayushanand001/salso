const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "OTP Verification",
    text: `Verification Code (OTP): ${otp}

Dear User,

Your One-Time Password (OTP) for verification is ${otp}. This code is valid for 5 minutes.

Please do not share this OTP with anyone for security reasons. If you did not request this code, please ignore this message.

Thank you,
TEAM SALSO`
  });
};
