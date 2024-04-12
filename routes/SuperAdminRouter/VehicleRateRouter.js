const { vehicle_rate, get_vehicle, save_add_vehicle_rate } = require('../../controller/superadmin/vehicleRate.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const VehicleRateRouter = require('express').Router();

VehicleRateRouter.all('/vehicle_rate',AuthSuperCheckedMW,vehicle_rate),
VehicleRateRouter.post('/vehicle_dt',AuthSuperCheckedMW,get_vehicle),
VehicleRateRouter.post('/vehicle_rate_save',AuthSuperCheckedMW,save_add_vehicle_rate),

module.exports = {VehicleRateRouter}