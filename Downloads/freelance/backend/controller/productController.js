const Product = require("../model/Productmodel");
exports.createproduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "product creating failed" });
  }
};
// get all products
exports.getAllproducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "get all products failling" });
  }
};
// get single products
exports.getsingleproducts = async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "get single products failling" });
  }
};
exports.updateproducts = async (req, res) => {
  try {
    const produts = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(produts);
  } catch (err) {
    res.status(500).json({ message: "update products failling" });
  }
};
exports.deleteproducts = async (req, res) => {
  try {
    const products = await Product.findByIdAndDelete(req.params.id);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "delete section will be failling" });
  }
};
