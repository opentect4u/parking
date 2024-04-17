const { device } = require('../../controller/superadmin/device_setting.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const DeviceSettingRouter = require('express').Router();

DeviceSettingRouter.all('/device_setting',AuthSuperCheckedMW,device)

module.exports = {DeviceSettingRouter}