const Cart = require("../model/Cart");

const cartData = async (req, res) => {
  try {
    if (!req.session.email) return null;
    const user = req.session.email;
    // get cart items for user, and each item details in cart.items from Products collection
    const cart = await Cart.findOne({ user: user })
      .populate("items.product")
      .exec();
    if (!cart) return 0;
    return cart;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const addToCart = async (req, res) => {
  try {
    if (!req?.body?.items) {
      return res
        .status(400)
        .json({ message: "Please select an item to add to cart." });
    }

    const user = req.session.email;
    // check if cart exists
    const cart = await Cart.findOne({ user: user }).exec();
    // if cart exists, add item to cart's items sub document
    if (cart) {
      cart.items.push(req.body.items);
      const result = await cart.save();
      return res.status(201).json({ status: 201, data: result });
    }
    // else create a new cart
    const result = await Cart.create({
      user: user,
      items: req.body.items,
    });

    return res.status(201).json({ status: 201, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCart = async (req, res) => {
  try {
    if (!req?.body?.items) {
      return res.status(400).json({
        status: 400,
        message: "Please select an item to add to cart.",
      });
    }

    const user = req.session.email;
    // check if cart exists
    const cart = await Cart.findOne({ user: user }).exec();
    // if cart exists, add item to cart's items sub document
    if (cart) {
      // req.body.items is an array of items like {itemId : 123, quantity : 2}
      // loop through each item in req.body.items and update cart.items where item._id === req.body.items[i].itemId
      req.body.items.forEach((item) => {
        cart.items.forEach((cartItem) => {
          if (cartItem._id.toString() === item.itemId) {
            cartItem.quantity = item.quantity;
            // if quantity is 0, remove item from cart
            if (item.quantity == 0) {
              cart.items.pull(cartItem);
            }
          }
        });
      });
      const result = await cart.save();
      return res.status(200).json({ status: 200, data: result });
    }
    // cart not found
    return res.status(404).json({ status: 404, message: "Cart not found" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  cartData,
  addToCart,
  updateCart,
};
