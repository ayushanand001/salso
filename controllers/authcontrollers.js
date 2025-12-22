const User = require("../models/User");
const bcrypt = require("bcrypt");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.render("register", { error: "User already exists" });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // save user
  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();
  res.redirect("/login");
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.send("User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.send("Invalid password");
  }

  req.session.user = user;
  res.redirect("/dashboard");
};

/* ================= LOGOUT ================= */
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
