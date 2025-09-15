const { report_permit, save_edit_report_permitt, report_permit_edit } = require('../../controller/superadmin/report_permit.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const ReportPermitRouter = require('express').Router();
 
ReportPermitRouter.all('/report_permission',AuthSuperCheckedMW,report_permit);
ReportPermitRouter.get('/edit_report_permission',AuthSuperCheckedMW,report_permit_edit);
ReportPermitRouter.post('/save_report_permit',AuthSuperCheckedMW,save_edit_report_permitt);

module.exports = {ReportPermitRouter}