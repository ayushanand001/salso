const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// Middleware for parsing request bodies
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Update booking status by booking id
router.post("/bookings/update-status", async (req, res) => {
  const { id, status } = req.body;
  console.log("Received booking status update:", req.body);
  try {
    // Use booking `id` in WHERE clause (not salon_id)
    await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [status, id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;