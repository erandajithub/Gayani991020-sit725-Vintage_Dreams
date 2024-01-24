const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// User Views
router
  .route("/my-account")
  .get(verifyRoles(ROLES_LIST.User), usersController.loadMyAccountPage);
router
  .route("/shopping-cart")
  .get(verifyRoles(ROLES_LIST.User), usersController.loadViewCartPage);
router
  .route("/wishlist")
  .get(verifyRoles(ROLES_LIST.User), usersController.loadWishlistPage);

module.exports = router;
