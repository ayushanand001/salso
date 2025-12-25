const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { subtotal, grandtotal } = req.body;
  console.log(subtotal, grandtotal);

  res.json({ success: true });
});

module.exports = router;
