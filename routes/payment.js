const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || "vwhwP1";
const MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || "mrMkAlEm3KR528jpIoGPJ3jCh5fDw6F0";
const PAYU_BASE = process.env.PAYU_BASE || "https://test.payu.in";

router.post("/pay", (req, res) => {
  const { amount, firstname, email, salon_id } = req.body;

  const txnid = "TXN" + Date.now();

  const productinfo = `Salon Booking - ${salon_id || 'NA'}`;

  const hashString = `${MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${MERCHANT_SALT}`;

  const hash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

  res.render("payuform", {
    key: MERCHANT_KEY,
    txnid,
    amount,
    firstname,
    email,
    hash,
    salon_id,
    productinfo,
    surl: `${baseUrl}/payment-success`,
    furl: `${baseUrl}/payment-failure`,
    payu_url: PAYU_BASE + '/_payment'
  });
});


// PayU will POST the response to these endpoints.
router.post('/payment-success', (req, res) => {
  // Verify response hash
  const body = req.body || {};
  const status = body.status || '';

  // Build hash string according to PayU response verification
  const responseHashString = `${MERCHANT_SALT}|${status}|||||||||||${body.email || ''}|${body.firstname || ''}|${body.productinfo || ''}|${body.amount || ''}|${body.txnid || ''}|${MERCHANT_KEY}`;
  const calculatedHash = crypto.createHash('sha512').update(responseHashString).digest('hex');

  const valid = (calculatedHash === (body.hash || '').toString());

  res.render('payment-success', { data: body, valid, calculatedHash });
});

router.post('/payment-failure', (req, res) => {
  res.render('payment-failure', { data: req.body });
});


module.exports = router;
