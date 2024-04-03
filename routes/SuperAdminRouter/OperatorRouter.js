const { operator, show_operator_dtls, operator_edit, save_add_operator } = require('../../controller/superadmin/operator.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const OperatorRouter = require('express').Router();

OperatorRouter.all('/operator',AuthSuperCheckedMW,operator);
OperatorRouter.get('/operator_dtls',AuthSuperCheckedMW,show_operator_dtls);
OperatorRouter.get('/edit_operator',AuthSuperCheckedMW,operator_edit);
OperatorRouter.post('/operator_save',AuthSuperCheckedMW,save_add_operator);

module.exports = {OperatorRouter}