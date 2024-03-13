const { cust_name, show_customer, edit_customer, add_customer, edit_save_customer } = require('../controller/customer/Customer.controller');
const { AuthCheckedMW } = require('../middleware/AuthChecked.middleware');

const express = require ('express'),
Customer_settingRouter = express.Router();

Customer_settingRouter.get('/customer_dt',AuthCheckedMW,cust_name);
Customer_settingRouter.get('/show_customer_dtls',AuthCheckedMW,show_customer);
Customer_settingRouter.get('/edit_customer_details',AuthCheckedMW,edit_customer);
Customer_settingRouter.post('/edit_customer',AuthCheckedMW,edit_save_customer);

module.exports = { Customer_settingRouter }