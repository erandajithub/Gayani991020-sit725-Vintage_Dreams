const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    verifyRoles(ROLES_LIST.Admin),
    productController.createNewProduct
  )
  .post(
    verifyRoles(ROLES_LIST.Admin),
    productController.uploadPhoto
  );
// .put(verifyRoles(ROLES_LIST.Admin), employeesController.updateEmployee)
// .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router
  .route("/upload")
  .post(
    verifyRoles(ROLES_LIST.Admin),
    productController.uploadPhoto
  );

router.route('/getProductById')
    .get(productController.getProductById);

module.exports = router;
