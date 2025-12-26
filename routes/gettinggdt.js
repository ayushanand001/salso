const express = require("express");
const pool = require("../db/db");
const router = express.Router();

module.exports = router;

router.post("/checkout", async (req, res) => {
  console.log(req.body)
  const { subtotal, grandtotal, salon_id, salon_name } = req.body;

  if (!salon_id) {
    return res.status(400).send("Salon ID missing");
  }
  const name=await pool.query("SELECT name FROM salons WHERE id = $1", [salon_id]);
  console.log(name.rows[0].name);

  if (grandtotal > 0) {
    res.render("paymentpage", { subtotal, grandtotal, salon_id, salon_name: name.rows[0].name });
  } else {
    res.redirect(`/salons/${salon_id}`);
  }
});
