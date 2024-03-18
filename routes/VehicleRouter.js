const { vehicle, vehicle_icon, save_add_vehicle, edit_vehicle, save_edit_vehicle } = require('../controller/customer/Vehicle.controller');
const { AuthCheckedMW } = require('../middleware/AuthChecked.middleware');

const vehicleRouter = require('express').Router(),
dateFormat = require('dateformat');

vehicleRouter.get('/vehicle_details',AuthCheckedMW,vehicle);
vehicleRouter.post('/add_save_vehicle',AuthCheckedMW,save_add_vehicle);
vehicleRouter.get('/edit_vehicle_details',AuthCheckedMW,edit_vehicle);
vehicleRouter.post('/edit_save_vehicle',AuthCheckedMW,save_edit_vehicle);


module.exports = {vehicleRouter}