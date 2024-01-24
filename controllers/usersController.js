const User = require("../model/User");
const Order = require("../model/Order");
const Wishlist = require("../model/Wishlist");
const cartController = require("./cartController");
const wishlistController = require("./wishlistController");

const loadMyAccountPage = async (req, res) => {
  const email = req.session.email;
  const foundUser = await User.findOne({ email: email }).exec();
  const cart = await cartController.cartData(req, res);
  // get orders for user with cart.items details from Products collection
  const orders = await Order.find({ user: email })
    .populate("items.product")
    .exec();
  res.render("my-account.ejs", { user: foundUser, cart: cart, orders: orders });
};
const loadViewCartPage = async (req, res) => {
  const email = req.session.email;
  const foundUser = await User.findOne({ email: email }).exec();
  const cart = await cartController.cartData(req, res);
  res.render("shoping-cart.ejs", { user: foundUser, cart: cart });
};
const loadWishlistPage = async (req, res) => {
  const email = req.session.email;
  const foundUser = await User.findOne({ email: email }).exec();
  const cart = await cartController.cartData(req, res);
  const wishlist = await wishlistController.wishlistData(req, res);
  res.render("wishlist.ejs", { user: foundUser, wishlist: wishlist, cart: cart });
};
module.exports = {
  loadMyAccountPage,
  loadViewCartPage,
  loadWishlistPage,
};
