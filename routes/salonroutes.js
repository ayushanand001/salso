const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddlewares");
const { isAdmin } = require("../middlewares/roleMiddlewares");
const salonController = require("../controllers/saloncontrollers");

router.get("/salons/owners", verifyToken, isAdmin, salonController.getSalonsByRole);
router.get("/salons", verifyToken, salonController.getAllSalons);
router.get("/salons/:id", verifyToken, salonController.getSalonsById);

router.get("/api/salons/search", verifyToken, salonController.searchSalons);
module.exports = router;
