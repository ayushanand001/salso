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
const features=await pool.query("SELECT * FROM salon_features WHERE salon_id=$1",[salonId]);
    res.render("salonDetails", { salon: result.rows[0], features: features.rows  });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching salon details");
  }
};
exports.getSalonsByRole = async (req, res) => {
  try {
    // This route is for admin/salon owners dashboard
    res.render("salonDashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading salon dashboard");
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
exports.implementSaloonFeatures=async(req,res)=>
{
  try {
    const features=await pool.query("SELECT * FROM salon_features WHERE salon_id=$1",[req.params.id]);
    res.json(features.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching salon features" });
  }
}
