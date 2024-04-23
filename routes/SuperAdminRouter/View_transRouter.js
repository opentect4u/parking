const { transaction, transaction_show, transaction_show_dtls, transaction_dtls } = require('../../controller/superadmin/view_trans.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const View_transRouter = require('express').Router();

View_transRouter.get('/view_trans',AuthSuperCheckedMW,transaction);
View_transRouter.post('/show_view_trans',AuthSuperCheckedMW,transaction_dtls);


module.exports = {View_transRouter}