const { dashboard_data } = require('../../controller/superadmin/dashboard.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware')

const dashboardRouter = require('express').Router()

dashboardRouter.get('/dashboard',AuthSuperCheckedMW,dashboard_data);

module.exports = {dashboardRouter}