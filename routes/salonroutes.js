const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddlewares");
const { isAdmin } = require("../middlewares/roleMiddlewares");
const salonController = require("../controllers/saloncontrollers");

router.get(
  "/salons/:email",
  verifyToken,
  isAdmin,
  salonController.getSalonsByemail
);
router.get("/salons", verifyToken, salonController.getAllSalons);
router.get("/salon/:id", verifyToken, salonController.getSalonsById);
// Render memberships page (GET) — usable via link from salons.ejs
router.get("/memberships", verifyToken, (req, res) => {
  res.render("memberships");
});

router.get("/api/salons/search", verifyToken, salonController.searchSalons);
router.get(
  "/api/salons/:id/features",
  verifyToken,
  salonController.implementSaloonFeatures
);
router.use(express.urlencoded({ extended: true }));
module.exports = router;

module.exports = router;
