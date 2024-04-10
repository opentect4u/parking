const { vehicle_rate, get_vehicle } = require('../../controller/superadmin/vehicleRate.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const VehicleRateRouter = require('express').Router();

VehicleRateRouter.all('/vehicle_rate',AuthSuperCheckedMW,vehicle_rate),
VehicleRateRouter.post('/vehicle_dt',AuthSuperCheckedMW,get_vehicle)



module.exports = {VehicleRateRouter}