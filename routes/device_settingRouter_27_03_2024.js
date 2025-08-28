const express = require('express');
const { device, show_device, edit_device, save_edit_device, save_add_device } = require('../controller/customer/Device.controller');
const { AuthCheckedMW } = require('../middleware/AuthChecked.middleware');
 DeviceRouter = express.Router(),
 dateFormat = require('dateformat');

 DeviceRouter.get('/device_name',AuthCheckedMW,device);
 DeviceRouter.get('/device_details',AuthCheckedMW,show_device);
 DeviceRouter.get('/edit_device_details',AuthCheckedMW,edit_device);
 DeviceRouter.post('/edit_save_device',AuthCheckedMW,save_edit_device);
 DeviceRouter.post('/add_save_device',AuthCheckedMW,save_add_device);




 module.exports = { DeviceRouter }
