const { customer, customer_edit } = require('../../controller/superadmin/customer.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const CustomerRouter = require('express').Router();

CustomerRouter.get('/customer',AuthSuperCheckedMW,customer);
CustomerRouter.get('/edit_customer',AuthSuperCheckedMW,customer_edit);


module.exports = {CustomerRouter}