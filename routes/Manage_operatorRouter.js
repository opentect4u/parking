const { operator, add_operator, edit_operator, edit_operator_show, edit_save_operator } = require('../controller/customer/Operator.controller');
const { AuthCheckedMW } = require('../middleware/AuthChecked.middleware');

const express = require('express'),
Manage_operatorRouter = express.Router(),
dateFormat = require('dateformat');

Manage_operatorRouter.get('/manage_operator',AuthCheckedMW,operator);
Manage_operatorRouter.get('/operator_edit',AuthCheckedMW,edit_operator_show);
Manage_operatorRouter.post('/save_add_operator',AuthCheckedMW,add_operator);
Manage_operatorRouter.post('/save_edit_operator',AuthCheckedMW,edit_save_operator);

module.exports = { Manage_operatorRouter }