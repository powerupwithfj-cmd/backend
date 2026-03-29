const Product = require("../model/Productmodel");

// CREATE PRODUCT
exports.createproduct = async (req, res) => {
  try {
    let images = [];

    // If images uploaded
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.path.replace(/\\/g, "/"));
    }

    const product = await Product.create({
      ...req.body,
      images,
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Product creation failed" });
  }
};

// GET ALL PRODUCTS
exports.getAllproducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Get all products failing" });
  }
};

// GET SINGLE PRODUCT
exports.getsingleproducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Get single product failing" });
  }
};

// UPDATE PRODUCT
exports.updateproducts = async (req, res) => {
  try {
    const existingImages = JSON.parse(req.body.existingImages || "[]");

    let images = existingImages;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) =>
        file.path.replace(/\\/g, "/")
      );
      images = [...existingImages, ...newImages];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images,
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update product failed" });
  }
};

// DELETE PRODUCT
exports.deleteproducts = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Delete product failed" });
  }
};
