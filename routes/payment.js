const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { SendOrderConfirmationMail } = require("../utils/sendMail");
const pool = require("../db/db");
const { verifyToken } = require("../middlewares/authMiddlewares");

const MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || "vwhwP1";
const MERCHANT_SALT =
  process.env.PAYU_MERCHANT_SALT || "mrMkAlEm3KR528jpIoGPJ3jCh5fDw6F0";
const PAYU_BASE = process.env.PAYU_BASE || "https://test.payu.in";

router.post("/pay", verifyToken, async (req, res) => {
  console.log(req.body);
  const {
    amount,
    firstname,
    email,
    salon_id,
    dayslot,
    timeslot,
    feature_price,
  } = req.body;

  let features = "";
  const featureArray = JSON.parse(feature_price);
  featureArray.forEach((element) => {
    features += element.feature + ",";
  });

  const booking = await pool.query(
    "INSERT INTO bookings(salon_id, user_id, feature_name, timeslot, dayslot, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [salon_id, req.user.id, features, timeslot, dayslot, "pending"]
  );
  console.log(booking.rows[0].id);
  const txnid = "TXN" + Date.now();

  const productinfo = `Salon Booking - ${salon_id || "NA"}`;

  const hashString = `${MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${MERCHANT_SALT}`;

  const hash = crypto.createHash("sha512").update(hashString).digest("hex");
  const baseUrl =
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  console.log("Email:", email, "Salon ID:", salon_id);

  res.render("payuform", {
    key: MERCHANT_KEY,
    txnid,
    amount,
    firstname,
    email,
    hash,
    salon_id,
    productinfo,
    surl: `${baseUrl}/payment-success?id=${booking.rows[0].id}`,
    furl: `${baseUrl}/payment-failure`,
    payu_url: PAYU_BASE + "/_payment",
  });
  await SendOrderConfirmationMail(email, salon_id);
});

// PayU will POST the response to these endpoints.
router.post("/payment-success", async (req, res) => {
  // Verify response hash
  const body = req.body || {};
  const status = body.status || "";
  const id = req.query.id;

  // Build hash string according to PayU response verification
  const responseHashString = `${MERCHANT_SALT}|${status}|||||||||||${
    body.email || ""
  }|${body.firstname || ""}|${body.productinfo || ""}|${body.amount || ""}|${
    body.txnid || ""
  }|${MERCHANT_KEY}`;
  const calculatedHash = crypto
    .createHash("sha512")
    .update(responseHashString)
    .digest("hex");

  const valid = calculatedHash === (body.hash || "").toString();
  if (valid && status === "success") {
    await pool.query("UPDATE bookings SET status='scheduled' where id=$1", [
      id,
    ]);
    res.render("payment-success", { data: body, valid, calculatedHash });
  } else res.redirect("/payment-failure");
});

router.post("/payment-failure", (req, res) => {
  res.render("payment-failure", { data: req.body });
});

module.exports = router;
