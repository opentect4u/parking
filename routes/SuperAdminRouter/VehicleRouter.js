const { vehicle, show_vehicle_dtls, save_add_vehicle, vehicle_edit } = require('../../controller/superadmin/vehicle.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const VehicleRouter = require('express').Router();

VehicleRouter.all('/vehicle',AuthSuperCheckedMW,vehicle);
VehicleRouter.get('/vehicle_dtls',AuthSuperCheckedMW,show_vehicle_dtls);
VehicleRouter.get('/edit_vehicle',AuthSuperCheckedMW,vehicle_edit);
VehicleRouter.post('/vehicle_save',AuthSuperCheckedMW,save_add_vehicle);

module.exports = {VehicleRouter}