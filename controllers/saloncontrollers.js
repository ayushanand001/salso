const pool = require("../db/db");
exports.getAllSalons = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM salons");
    res.render("salons", { salons: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching salons");
  }
};
exports.getSalonsById = async (req, res) => {
  try {
    const salonId = req.params.id;
    const result = await pool.query("SELECT * FROM salons WHERE id=$1", [
      salonId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Salon not found");
    }
    const features = await pool.query(
      "SELECT * FROM salon_features WHERE salon_id=$1",
      [salonId]
    );
    res.render("salonDetails", {
      salon: result.rows[0],
      features: features.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching salon details");
  }
};

exports.searchSalons = async (req, res) => {
  try {
    const search = req.query.search || "";

    // If search is empty, return all salons
    if (!search.trim()) {
      const result = await pool.query("SELECT * FROM salons ORDER BY name");
      return res.json(result.rows);
    }

    // Search by name or location (case-insensitive)
    const result = await pool.query(
      `SELECT * FROM salons WHERE name ILIKE $1 OR location ILIKE $1 ORDER BY name`,
      [`%${search}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error searching salons" });
  }
};
exports.implementSaloonFeatures = async (req, res) => {
  try {
    const features = await pool.query(
      "SELECT * FROM salon_features WHERE salon_id=$1",
      [req.params.id]
    );
    res.json(features.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching salon features" });
  }
};
exports.getSalonsByemail = async (req, res) => {
  try {
    // Use authenticated user's email from the JWT
    const email = req.params && req.params.email;

    if (!email) {
      return res.status(400).send("Owner email not available");
    }

    const result = await pool.query("SELECT * FROM salons WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0) {
      // render dashboard with no salon (view will show friendly message)
      return res.render("salonDashboard", { salon: null });
    }

    res.render("salonDashboard", {
      salon: result.rows[0],
      bookings: bookings.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching owner's salons");
  }
};
