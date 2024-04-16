const { shift, show_shift_dtls, shift_edit, save_add_shift } = require('../../controller/superadmin/shift.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const ShiftRouter = require('express').Router();

ShiftRouter.all('/shift',AuthSuperCheckedMW,shift);
ShiftRouter.get('/edit_shift',AuthSuperCheckedMW,shift_edit);
ShiftRouter.post('/save_shift',AuthSuperCheckedMW,save_add_shift);

module.exports = {ShiftRouter}