const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), orderController.getAllOrders)
    .post(verifyRoles(ROLES_LIST.User), orderController.placeOrder)
    .post(verifyRoles(ROLES_LIST.Admin), orderController.getAllOrders)
router.route('/get-all-orders')
    .post(verifyRoles(ROLES_LIST.Admin), orderController.getAllOrders)
router.route('/update-order-status')
    .post(verifyRoles(ROLES_LIST.Admin), orderController.updateOrderStatus)
    // .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    // .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

// router.route('/:id')
//     .get(employeesController.getEmployee);

module.exports = router;