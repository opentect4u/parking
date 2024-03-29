const { customer } = require('../../controller/superadmin/customer.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const CustomerRouter = require('express').Router();

CustomerRouter.get('/customer',AuthSuperCheckedMW,customer)


module.exports = {CustomerRouter}