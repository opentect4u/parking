const express = require('express');
const { test, login, login_post } = require('../controller/customer/CAuth.controller');
const { dashboard, blank } = require('../controller/customer/Dashboard.controller');
const { AuthCheckedMW, LoginCheckedMW, logout } = require('../middleware/AuthChecked.middleware');
const { vehicle, operator_add, operator_add_post, password_change, save_report_password, report_pwd, location_name, seller_location_name, my_profile_save, password, change_report_flag } = require('../controller/customer/Master_cust.controller');

const Customer=express.Router();

Customer.get('/test',test);
Customer.get('/login',LoginCheckedMW,login);
Customer.post('/login',LoginCheckedMW,login_post);
Customer.get('/logout',logout);



Customer.get('/',AuthCheckedMW,dashboard);

Customer.get('/blank',AuthCheckedMW,blank);



Customer.get('/vehicle',AuthCheckedMW,vehicle);

Customer.get('/operator/add',AuthCheckedMW,operator_add);
Customer.post('/operator/add',AuthCheckedMW,operator_add_post);

Customer.get('/password',AuthCheckedMW,password_change);
Customer.post('/password_dt',AuthCheckedMW,report_pwd);
Customer.post('/report_password_save',AuthCheckedMW,save_report_password);

Customer.get('/location_details',AuthCheckedMW,location_name);
Customer.post('/save_my_profile',AuthCheckedMW,my_profile_save);

Customer.post('/password',AuthCheckedMW,password);


module.exports = {Customer};