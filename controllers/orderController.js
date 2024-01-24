const Order = require("../model/Order");
const Cart = require("../model/Cart");
const Product = require("../model/Product");

const getAllOrders = async (req, res) => {
  const orders = await Order.find();
  if (!orders) return res.status(204).json({ message: "No orders found." });
  res.json(orders);
};

const placeOrder = async (req, res) => {
  try {
    // check if cartId, shippingAddress, and paymentMethod are provided
    if (!req?.body?.cartId) {
      return res.json({
        status: 400,
        message: "No cart selected for purchase.",
      });
    }
    if (!req?.body?.shippingAddress) {
      return res.json({
        status: 400,
        message: "Shippping Address is required.",
      });
    }
    if (!req?.body?.telephone) {
      return res.json({
        status: 400,
        message: "Telephone Number is required.",
      });
    }
    if (!req?.body?.paymentMethod) {
      return res.json({ status: 400, message: "Payment method is required." });
    }

    // if payment method is card, check if card details are provided
    if (req?.body?.paymentMethod == 1) {
      if (
        !req?.body?.cardNumber ||
        !req?.body?.cardExpiry ||
        !req?.body?.cardCVV
      ) {
        return res.json({ status: 400, message: "Card details are required." });
      }
    }

    // check if cart exists, if exists, get cart items
    const cart = await Cart.findById(req.body.cartId);
    if (!cart) {
      return res.json({ status: 400, message: "Cart not found." });
    }
    const cartItems = cart.items;

    // check if cart is empty
    if (cartItems.length === 0) {
      return res.json({ status: 400, message: "Cart is empty." });
    }

    // check if cart items are in stock based on size
    let outOfStock = false;
    let outOfStockItems = [];
    cartItems.forEach(async (item) => {
      const product = await Product.findById(item.product);
      // item.quantity from product.stockQuantity.value where product.stockQuantity.size == item.size
      const index = product.stockQuantity.findIndex(
        (stock) => stock.size == item.size
      );
      if (product.stockQuantity[index].value < item.quantity) {
        outOfStock = true;
        outOfStockItems.push(product.name);
      }
    });

    // if any item is out of stock, return error
    if (outOfStock) {
      return res.json({
        status: 400,
        message: `The following items are out of stock: ${outOfStockItems.join(
          ", "
        )}`,
      });
    }

    // get total price of cart items
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    // create order
    const order = new Order({
      user: req.session.email,
      items: cartItems,
      shippingAddress: req.body.shippingAddress,
      telephone: req.body.telephone,
      paymentMethod: req.body.paymentMethod == 2 ? "Cash On Delivery" : "Card",
      totalPrice: totalPrice,
    });

    // if payment method is card, add paidAt time
    if (req.body.paymentMethod == 1) {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    // save order
    const savedOrder = await order.save();
    if (!savedOrder) {
      return res
        .status(500)
        .json({ status: 500, message: "Order could not be placed." });
    }

    // delete cart
    await cart.remove();

    // adjust stock
    cartItems.forEach(async (item) => {
      const product = await Product.findById(item.product);
      // minimize item.quantity from product.stockQuantity.value where product.stockQuantity.size == item.size
      const index = product.stockQuantity.findIndex(
        (stock) => stock.size == item.size
      );
      product.stockQuantity[index].value -= item.quantity;
      await product.save();
    });

    // return 201 status code and order details
    res.status(201).json({ status: 201, message: savedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    // check if orderId and status are provided
    if (!req?.body?.orderId) {
      return res.json({ status: 400, message: "No order selected." });
    }
    if (!req?.body?.status) {
      return res.json({ status: 400, message: "Status is required." });
    }

    // check if order exists
    const order = await Order.findById(req.body.orderId);
    if (!order) {
      return res.json({ status: 400, message: "Order not found." });
    }

    // update order status
    order.status = req.body.status;
    if (req.body.status == "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    const updatedOrder = await order.save();
    if (!updatedOrder) {
      return res
        .status(500)
        .json({ status: 500, message: "Order could not be updated." });
    }

    // return 200 status code and updated order details
    res
      .status(200)
      .json({ status: 200, message: "Order status updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

module.exports = {
  getAllOrders,
  placeOrder,
  updateOrderStatus,
};
