const express = require("express");
const router = express.Router();

const productCtrl = require("../controller/productController");
const { isAdmin } = require("../middileware/isAdmin");
const { protect } = require("../middileware/authMiddleware");
const upload = require("../middileware/upload");

// Admin CRUD
router.post(
  "/",
  protect,
  isAdmin,
  upload.array("images", 5), // ⭐ FIXED
  productCtrl.createproduct
);

router.put(
  "/:id",
  protect,
  isAdmin,
  upload.array("images", 5), // ⭐ FIXED
  productCtrl.updateproducts
);

router.delete("/:id", protect, isAdmin, productCtrl.deleteproducts);

// User routes
router.get("/", productCtrl.getAllproducts);
router.get("/:id", productCtrl.getsingleproducts);

module.exports = router;
