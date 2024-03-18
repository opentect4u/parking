const { vehicle_rate } = require('../controller/customer/Vehicle_rate.controller');
const { AuthCheckedMW } = require('../middleware/AuthChecked.middleware');

const vehicle_rateRouter = require('express').Router();

vehicle_rateRouter.get('/vehicle_rate_dtls',AuthCheckedMW,vehicle_rate);

module.exports = { vehicle_rateRouter }
