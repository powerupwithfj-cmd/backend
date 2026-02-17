const express = require("express");
const router = express.Router();
const { googleAuth, refreshToken, getCurrentUser } = require("../controller/authcontroler");
const { protect } = require("../middileware/authmiddileware");

router.post("/google", googleAuth);
router.post("/refresh", refreshToken);
router.get("/current", protect, getCurrentUser);

module.exports = router;
