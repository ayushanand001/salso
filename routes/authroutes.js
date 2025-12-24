const express = require("express");
const router = express.Router();
const auth = require("../controllers/authcontrollers");
const authController = require("../controllers/authcontrollers");

router.get("/verify-otp", authController.showVerifyOtp);
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
router.get("/", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

//new part
router.get("/resendOtp", auth.resendOtp);

module.exports = router;
