const { shift, save_add_shift, edit_shift, save_edit_shift } = require('../controller/customer/Shift.controller');
const { AuthCheckedMW } = require('../middleware/AuthChecked.middleware');

const express = require('express'),
ShiftRouter = express.Router();

ShiftRouter.get('/shift_details',AuthCheckedMW,shift);
ShiftRouter.post('/add_save_shift',AuthCheckedMW,save_add_shift);
ShiftRouter.get('/edit_shift_details',AuthCheckedMW,edit_shift);
ShiftRouter.post('/edit_save_shift',AuthCheckedMW,save_edit_shift);


module.exports = {ShiftRouter }