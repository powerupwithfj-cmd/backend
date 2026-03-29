const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  blockUser,
  unblockUser,
  changeRole,
} = require("../controller/adminUserControler");

const { protect} = require("../middileware/authMiddleware");
const { isAdmin} = require("../middileware/isAdmin");
router.get("/", protect, isAdmin, getAllUsers);
router.put("/block/:id", protect, isAdmin, blockUser);
router.put("/unblock/:id", protect, isAdmin, unblockUser);
router.put("/role/:id", protect, isAdmin, changeRole);

module.exports = router;
