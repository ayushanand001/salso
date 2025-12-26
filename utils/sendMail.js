const nodemailer = require("nodemailer");
const pool = require("../db/db");

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

exports.SendOrderConfirmationMail = async (to, salon_id) => {
  console.log(salon_id)
  const newvar=await pool.query("SELECT * FROM salons WHERE id=$1", [salon_id]);
console.log(newvar.rows[0])
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Order Confirmation",
    text: `Dear Customer, 

order has been successfully requested for the salon: ${newvar.rows[0].name} for your selected services.

We appreciate your business and look forward to serving you again.
please complete payment to confirm your booking
Thank you for shopping with us!
TEAM SALSO`   
  });
};