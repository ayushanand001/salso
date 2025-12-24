const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddlewares");
const { isAdmin } = require("../middlewares/roleMiddlewares");


router.get("/dashboard", verifyToken, (req, res) => {
  console.log("hello");
  res.render("dashboard", { user: req.user });
});

router.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.render("admin");
});

module.exports = router;
