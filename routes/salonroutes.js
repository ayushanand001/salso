const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddlewares");
const { isAdmin } = require("../middlewares/roleMiddlewares");
const salonController = require("../controllers/saloncontrollers");

router.get("/salons/role", verifyToken, isAdmin, (req, res) => {
  res.render("salonDashboard");
});
router.get("/salons/:id", verifyToken, salonController.getSalonsById);
router.get("/salons", verifyToken, salonController.getAllSalons);

router.get("/api/salons/search", verifyToken, salonController.searchSalons);
module.exports = router;
