const { vehicle_rate, get_vehicle_id, show_veichle, save_add_vehicle_rate, edit_vehicle_rate, save_edit_vehicle_rate } = require('../controller/customer/Vehicle_rate.controller');
const { AuthCheckedMW } = require('../middleware/AuthChecked.middleware');

const vehicle_rateRouter = require('express').Router();

vehicle_rateRouter.get('/vehicle_rate_dtls',AuthCheckedMW,vehicle_rate);
vehicle_rateRouter.post('/get_vehicle_id',AuthCheckedMW,get_vehicle_id);
vehicle_rateRouter.get('/vehicle_details',AuthCheckedMW,show_veichle);
vehicle_rateRouter.post('/add_save_vehicle_rate',AuthCheckedMW,save_add_vehicle_rate);
vehicle_rateRouter.get('/edit_vehicle_rate_details',AuthCheckedMW,edit_vehicle_rate);
vehicle_rateRouter.post('/edit_save_vehicle_rate',AuthCheckedMW,save_edit_vehicle_rate);

module.exports = { vehicle_rateRouter }
