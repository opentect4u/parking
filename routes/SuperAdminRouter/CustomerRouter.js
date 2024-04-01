const { customer, customer_edit, save_add_customer } = require('../../controller/superadmin/customer.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const CustomerRouter = require('express').Router();

CustomerRouter.get('/customer',AuthSuperCheckedMW,customer);
CustomerRouter.get('/edit_customer',AuthSuperCheckedMW,customer_edit);
CustomerRouter.post('/customer_save',AuthSuperCheckedMW,save_add_customer);


module.exports = {CustomerRouter}