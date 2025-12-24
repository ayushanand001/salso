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
    res.render("salonDetails", { salon: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching salon details");
  }
};
