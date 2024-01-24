const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const productController = require('../controllers/productController');

router.get('/', homeController.loadHomePage);

router.get('/getProductById/:id', productController.getProductById);

router.get('/login(.html)?', (req, res) => {
    res.render('login');
});
router.get('/register(.html)?', (req, res) => {
    res.render('register');
});
router.get('/contact(.html)?', homeController.loadContactPage);

router.get('/blog(.html)?', homeController.loadBlogPage);
router.get('/about(.html)?', homeController.loadAboutPage);

module.exports = router;