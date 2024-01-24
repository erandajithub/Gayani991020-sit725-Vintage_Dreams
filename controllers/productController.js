const Product = require("../model/Product");
const path = require("path");

const getAllProducts = async (req, res) => {
  const products = await Product.find();
  if (!products) return res.status(204).json({ message: "No products found." });
  res.json(products);
};

const createNewProduct = async (req, res) => {
  try {
    if (
      !req?.body?.name ||
      !req?.body?.category ||
      !req?.body?.size ||
      !req?.body?.price ||
      !req?.body?.cost ||
      !req?.body?.stockQuantity
    ) {
      return res.status(400).json({ message: req.body });
    }

    var photo = "";

    const result = await Product.create({
      name: req.body.name,
      description: req.body.description || "",
      category: req.body.category,
      size: req.body.size,
      price: req.body.price,
      cost: req.body.cost,
      stockQuantity: req.body.stockQuantity,
      photo: photo,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadPhoto = async (req, res) => {
  try {
    if (!req?.files?.photo) {
      return res.status(400).json({ message: "Photo required." });
    }

    const photo = req.files.photo;
    const photoName = `${Date.now()}-${photo.name}`;
    const photoPath = path.join(__dirname, "..", "public", "uploads", "products", photoName);

    photo.mv(photoPath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }

      const product = await Product.findOne({ _id: req.body.id }).exec();
      if (!product) {
        return res
          .status(204)
          .json({ message: `No product matches ID ${req.body.id}.` });
      }
      product.photo = photoName;
      const result = await product.save();
      res.json(result);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductById = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': req.params.id });
    }

    const product = await Product.findOne({ _id: req.params.id }).exec();
    if (!product) {
        return res.status(204).json({ "message": `No product matches ID ${req.params.id}.` });
    }
    res.status(200).json({"status" : 200, "data" : product});
}

module.exports = {
  getAllProducts,
  createNewProduct,
  uploadPhoto,
  getProductById,
};
