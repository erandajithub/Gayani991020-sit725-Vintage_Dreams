const path = require('path');
const Product = require('../model/Product');
const Order = require('../model/Order');

const loadIndexPage = async (req, res) => {
    res.render(path.join('admin', 'index.ejs'));
}

const loadNewProductPage = async (req, res) => {
    res.render(path.join('admin', 'new-product.ejs'));
}

const loadAllProductsPage = async (req, res) => {
    const products = await Product.find();
    res.render(path.join('admin', 'all-products.ejs'), { products : products });
}

const loadAllOrdersPage = async (req, res) => {
    const orders = await Order.find();
    res.render(path.join('admin', 'all-orders.ejs'), { orders : orders });
}

module.exports = {
    loadIndexPage,
    loadNewProductPage,
    loadAllProductsPage,
    loadAllOrdersPage
}