const { vehicle_rate, get_vehicle, save_add_vehicle_rate, getCustListAjax, vehicle_rate_edit } = require('../../controller/superadmin/vehicleRate.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const VehicleRateRouter = require('express').Router();

VehicleRateRouter.all('/vehicle_rate',AuthSuperCheckedMW,vehicle_rate),
VehicleRateRouter.post('/vehicle_dt',AuthSuperCheckedMW,get_vehicle),
VehicleRateRouter.post('/vehicle_rate_save',AuthSuperCheckedMW,save_add_vehicle_rate),
VehicleRateRouter.get('/vehicle_edit_rate',AuthSuperCheckedMW,vehicle_rate_edit),
VehicleRateRouter.post('/cust_list_ajax',AuthSuperCheckedMW,getCustListAjax),

module.exports = {VehicleRateRouter}