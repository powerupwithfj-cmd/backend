const express = require("express");
const router = express.Router();

const productCtrl = require("../controller/productController");
const isadmin = require("../middileware/isAdmin");
const { protect } = require("../middileware/authmiddileware");
const upload = require('../middileware/upload')
// Admin CRUD
router.post("/", protect, isadmin,upload, productCtrl.createproduct);
router.put("/:id", protect, isadmin, upload,productCtrl.updateproducts);
router.delete("/:id", protect, isadmin, productCtrl.deleteproducts);

// User routes
router.get("/", productCtrl.getAllproducts);
router.get("/:id", productCtrl.getsingleproducts);

module.exports = router;
