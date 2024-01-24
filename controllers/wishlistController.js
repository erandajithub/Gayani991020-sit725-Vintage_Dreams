const Wishlist = require("../model/Wishlist");

const wishlistData = async (req, res) => {
  try {
    if (!req.session.email) return null;
    const user = req.session.email;
    // get wishlist items for user, and each item details in wishlist.items from Products collection
    const wishlist = await Wishlist.findOne({ user: user })
      .populate("items.product")
      .exec();
    if (!wishlist) return 0;
    return wishlist;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const addToWishlist = async (req, res) => {
  try {
    if (!req?.body?.product) {
      return res
        .status(400)
        .json({ message: "Please select an item to add to wishlist." });
    }
    const user = req.session.email;
    // get wishlist for user, and push new item to wishlist.items
    const wishlist = await Wishlist.findOne({ user: user }).exec();

    if (!wishlist) {
      const newWishlist = new Wishlist({
        user: user,
        items: [{ product: req.body.product, addedTime: Date.now() }],
      });
      const result = await newWishlist.save();
      return res.status(200).json({ status: 200, data: result });
    }
    // check if item already exists in wishlist
    const index = wishlist.items.findIndex(
      (item) => item.product == req.body.product
    );
    if (index != -1) {
      return res
        .status(400)
        .json({ message: "Item already exists in wishlist." });
    }
    // add new item to wishlist
    wishlist.items.push({
      product: req.body.product,
      addedTime: Date.now(),
    });
    const result = await wishlist.save();
    return res.status(200).json({ status: 200, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// remove from wishlist where wishlist.items.product == req.body.productId
const removeFromWishlist = async (req, res) => {
  try {
    const user = req.session.email;
    const wishlist = await Wishlist.findOne({ user: user }).exec();
    if (!wishlist) {
      return res
        .status(404)
        .json({ status: 404, message: "Wishlist not found." });
    }

    const productId = req.body.productId;
    const index = wishlist.items.findIndex((item) => item.product == productId);
    if (index == -1) {
      return res
        .status(404)
        .json({ status: 404, message: "Item not found in wishlist." });
    }

    wishlist.items.splice(index, 1);
    const result = await wishlist.save();
    return res.status(200).json({ status: 200, data: result });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

module.exports = {
  wishlistData,
  addToWishlist,
  removeFromWishlist,
};
