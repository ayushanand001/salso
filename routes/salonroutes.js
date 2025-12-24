const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddlewares");
const { isAdmin } = require("../middlewares/roleMiddlewares");
const salonController = require("../controllers/saloncontrollers");


router.get("/salons", verifyToken, salonController.getAllSalons);
  

router.get("/salons/:id", verifyToken, salonController.getSalonsById);
 


module.exports = router;
