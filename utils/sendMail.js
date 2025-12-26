const nodemailer = require("nodemailer");
const pool = require("../db/db");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
TEAM SALSO`,
  });
};

exports.SendOrderConfirmationMail = async (to, booking_id) => {
  console.log(booking_id);
  const details = await pool.query(
    "SELECT * FROM salons JOIN bookings ON salons.id = bookings.salon_id WHERE bookings.id = $1",
    [booking_id]
  );
  const bookingDetails = details.rows[0];
  console.log(bookingDetails);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `Booking Confirmed: ${booking_id} | SALSO Premium`,
    text: `Dear Customer, 

Your reservation at ${bookingDetails.name} has been successfully confirmed. We have scheduled your session, and the stylist will be ready for you at the selected time.

Booking Details:
Services: ${bookingDetails.feature_name}
Date: ${bookingDetails.dayslot}
Time Slot: ${bookingDetails.timeslot}
Status: Scheduled
Location: ${bookingDetails.address}

Important Information:

Please arrive 5-10 minutes before your scheduled time.
Show this email or your Booking ID at the reception upon arrival.

Thank you for choosing SALSO Premium for your grooming needs. We look forward to seeing you!

Best regards, The SALSO Team`,
  });
};

// Subject: Booking Confirmed: <%= salon_name %> | SALSO Premium

// Dear <%= firstname %>,

// Your reservation at <%= salon_name %> has been successfully confirmed. We have scheduled your session, and the stylist will be ready for you at the selected time.

// Booking Details:

// Services: <%= feature_name %>

// Date: <%= dayslot %>

// Time Slot: <%= timeslot %>

// Total Amount: ₹<%= amount %>

// Status: Scheduled

// Location: <%= salon_address %>

// Important Information:

// Please arrive 5-10 minutes before your scheduled time.

// Show this email or your Booking ID at the reception upon arrival.

// Transaction ID: <%= txnid %>

// Thank you for choosing SALSO Premium for your grooming needs. We look forward to seeing you!

// Best regards, The SALSO Team
