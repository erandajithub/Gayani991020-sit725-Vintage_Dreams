const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/adminController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// Admin Views
router
  .route("/index")
  .get(verifyRoles(ROLES_LIST.Admin), adminController.loadIndexPage);
router
  .route("/new-product")
  .get(verifyRoles(ROLES_LIST.Admin), adminController.loadNewProductPage);
router
  .route("/all-products")
  .get(verifyRoles(ROLES_LIST.Admin), adminController.loadAllProductsPage);
router
  .route("/all-orders")
  .get(verifyRoles(ROLES_LIST.Admin), adminController.loadAllOrdersPage);

module.exports = router;
