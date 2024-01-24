const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.User), cartController.addToCart)
router.route('/updateCart')
    .post(verifyRoles(ROLES_LIST.User), cartController.updateCart)
    // .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

// router.route('/:id')
//     .get(employeesController.getEmployee);

module.exports = router;