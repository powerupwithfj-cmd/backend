const express = require("express");
const router = express.Router();
const { googleAuth, refreshToken, getCurrentUser,logout } = require("../controller/authcontroler");
const { protect } = require("../middileware/authMiddleware");

router.post("/google", googleAuth);
router.post("/refresh", refreshToken);
router.get("/current", protect, getCurrentUser);
router.post("/logout", logout);
module.exports = router;
