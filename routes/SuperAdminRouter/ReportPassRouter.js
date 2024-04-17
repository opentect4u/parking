const { report_password, edit_report_password, save_report_password } = require('../../controller/superadmin/reportpass.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const ReportPassRouter = require('express').Router();

ReportPassRouter.get('/report_pass',AuthSuperCheckedMW,report_password);
ReportPassRouter.get('/edit_report_pass',AuthSuperCheckedMW,edit_report_password)
ReportPassRouter.post('/save_report_pass',AuthSuperCheckedMW,save_report_password)

module.exports = {ReportPassRouter}