const { device, get_device_id, edit_device } = require('../../controller/superadmin/device_setting.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const DeviceSettingRouter = require('express').Router();

DeviceSettingRouter.all('/device_setting',AuthSuperCheckedMW,device);
DeviceSettingRouter.post('/device_dt',AuthSuperCheckedMW,get_device_id);
DeviceSettingRouter.get('/edit_device_setting',AuthSuperCheckedMW,edit_device);
DeviceSettingRouter.post('/dev_dt',AuthSuperCheckedMW,edit_device);


module.exports = {DeviceSettingRouter}