const { vehicle_rate } = require('../../controller/superadmin/vehicleRate.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const VehicleRateRouter = require('express').Router();

VehicleRateRouter.all('/vehicle_rate',AuthSuperCheckedMW,vehicle_rate)



module.exports = {VehicleRateRouter}