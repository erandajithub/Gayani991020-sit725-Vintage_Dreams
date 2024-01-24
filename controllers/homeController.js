const Product = require('../model/Product');
const cartController = require('./cartController');

const loadHomePage = async (req, res) => {
    const products = await Product.find();
    const cart = await cartController.cartData(req, res);
    res.render('index.ejs', { products : products , cart : cart});
}
const loadContactPage = async (req, res) => {
    const cart = await cartController.cartData(req, res);
    res.render('contact.ejs', { cart : cart});
}
const loadBlogPage = async (req, res) => {
    const cart = await cartController.cartData(req, res);
    res.render('blog.ejs', { cart : cart});
}
const loadAboutPage = async (req, res) => {
    const cart = await cartController.cartData(req, res);
    res.render('about.ejs', { cart : cart});
}

module.exports = {
    loadHomePage,
    loadContactPage,
    loadBlogPage,
    loadAboutPage
}