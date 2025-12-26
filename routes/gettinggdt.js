const express = require("express");
const router = express.Router();

module.exports = router;

router.post("/checkout", (req, res) => {
  const { subtotal, grandtotal, salon_id } = req.body;

  if (!salon_id) {
    return res.status(400).send("Salon ID missing");
  }

  if (grandtotal > 0) {
    res.render("paymentpage", { subtotal, grandtotal, salon_id });
  } else {
    res.redirect(`/salons/${salon_id}`);
  }
});
