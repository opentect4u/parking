const { dashboard_data, dashboard_page } = require('../../controller/superadmin/dashboard.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware')

const dashboardRouter = require('express').Router()

dashboardRouter.get('/dashboard',AuthSuperCheckedMW,dashboard_data);
dashboardRouter.get('/dashboard_page', AuthSuperCheckedMW, dashboard_page);


module.exports = {dashboardRouter}