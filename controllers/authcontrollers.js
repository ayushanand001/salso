const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOtpMail } = require("../utils/sendMail");
//registering part where otp is generated and sent to mail
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await pool.query("SELECT id FROM users WHERE email=$1", [
    email,
  ]);

  if (existing.rows.length > 0) {
    return res.render("register", { error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000);
<<<<<<< HEAD
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
=======
  const otpExpiry = Date.now() + 5 * 60 * 1000;
>>>>>>> efb160ffbd737e5a2cbb85146bb23a764298724a

  await pool.query(
    `INSERT INTO users (name, email, password, otp, otp_expiry)
     VALUES ($1,$2,$3,$4,$5)`,
    [name, email, hashedPassword, otp, otpExpiry]
  );

  await sendOtpMail(email, otp);

  res.redirect(`/verify-otp?email=${email}`);
};
//login part where token is generated after verifying user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  if (result.rows.length === 0) {
    return res.render("login", { error: "user not found" });
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.render("login", { error: "Invalid password" });
  }

  if (!user.is_verified) {
    return res.redirect(`/resendOtp/?email=${email}`);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, { httpOnly: true });
  res.redirect("/salons");
};
//otp verification part
exports.showVerifyOtp = (req, res) => {
  res.render("verifyOtp", {
    email: req.query.email,
    error: null,
  });
};
//otp verification part
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  const user = result.rows[0];
  if (
    !user ||
    String(user.otp) !== String(otp) ||
    Number(Date.now()) > Number(user.otp_expiry)
  ) {
    return res.render("verifyOtp", {
      email,
      error: "Invalid or expired OTP",
    });
  }

  await pool.query(
    `UPDATE users
     SET is_verified=true, otp=NULL, otp_expiry=NULL
     WHERE email=$1`,
    [email]
  );

  res.redirect("/login");
};

//resend otp part
exports.resendOtp = async (req, res) => {
  const email = req.query.email;
  console.log(email);
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  try {
    await pool.query(
      `UPDATE users
     SET otp=$1, otp_expiry=$2
     WHERE email=$3`,
      [otp, otpExpiry, email]
    );

    await sendOtpMail(email, otp);

    res.redirect(`/verify-otp?email=${email}`);
  } catch (err) {
    console.log(err);
    res.render("login", { error: "could not resend otp. please try again" });
  }
};
