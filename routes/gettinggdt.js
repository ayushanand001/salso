const express = require("express");
const router = express.Router();

router.post("/checkout", (req, res) => {
  const { subtotal, grandtotal } = req.body;
  console.log(subtotal, grandtotal);

  res.json({ success: true });
});

module.exports = router;
