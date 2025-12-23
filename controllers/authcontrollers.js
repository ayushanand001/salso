const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOtpMail } = require("../utils/sendMail");


exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await pool.query(
    "SELECT id FROM users WHERE email=$1",
    [email]
  );

  if (existing.rows.length > 0) {
    return res.render("register", { error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await pool.query(
    `INSERT INTO users (name, email, password, otp, otp_expiry)
     VALUES ($1,$2,$3,$4,$5)`,
    [name, email, hashedPassword, otp, otpExpiry]
  );

  await sendOtpMail(email, otp);

  res.redirect(`/verify-otp?email=${email}`);
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0) {
    return res.send("User not found");
  }

  const user = result.rows[0];

  if (!user.is_verified) {
    return res.send("Please verify your email first");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.send("Invalid password");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, { httpOnly: true });
  res.redirect("/dashboard");
};


exports.showVerifyOtp = (req, res) => {
  res.render("verifyOtp", {
    email: req.query.email,
    error: null
  });
};


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  const user = result.rows[0];

  if (
    !user ||
    user.otp !== otp ||
    new Date(user.otp_expiry) < new Date()
  ) {
    return res.render("verifyOtp", {
      email,
      error: "Invalid or expired OTP"
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
