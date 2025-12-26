const express = require("express");
const pool = require("../db/db");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddlewares");

module.exports = router;

router.post("/checkout", verifyToken, async (req, res) => {
  const { salon_id, dayslot, timeslot, service } = req.body;

  try {
    const name = await pool.query("SELECT name FROM salons WHERE id = $1", [
      salon_id,
    ]);

    if (name.rows.length === 0) {
      return res.status(404).send("Salon not found");
    }

    let subtotal = 0;
    let grandtotal = 49;

    //selected features array
    const selectedFeatures = service ? JSON.parse(service) : [];

    //retrive db of unique features and price
    const data = await pool.query(
      "SELECT feature_name, price FROM salon_features WHERE salon_id=$1 AND feature_name=ANY ($2)",
      [salon_id, selectedFeatures]
    );

    const uniquename_price = data.rows;

    // store all data in a new aray
    const features_price = [];
    uniquename_price.forEach((feature) => {
      const count = selectedFeatures.filter(
        (x) => x === feature.feature_name
      ).length;
      const price_new = feature.price * count;
      subtotal += price_new;
      features_price.push({
        feature: feature.feature_name,
        price: price_new,
        quantity: count,
      });
    });

    grandtotal += subtotal;
    console.log(features_price);

    if (grandtotal > 0) {
      res.render("paymentpage", {
        subtotal,
        grandtotal,
        salon_id,
        features_price,
        salon_name: name.rows[0].name,
        dayslot,
        timeslot,
      });
    } else {
      res.redirect(`/salons/${salon_id}`);
    }
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).send("Something went wrong with the checkout.");
  }
});
