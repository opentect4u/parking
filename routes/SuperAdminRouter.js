const SuperAdminRouter = require('express').Router()

const { CustomerRouter } = require('./SuperAdminRouter/CustomerRouter');
const { DeviceSettingRouter } = require('./SuperAdminRouter/DeviceSettingRouter');
const { GstRouter } = require('./SuperAdminRouter/GstRouter');
const { Header_FooterRouter } = require('./SuperAdminRouter/Header_FooterRouter');
const { LocationRouter } = require('./SuperAdminRouter/LocationRouter');
const { OperatorRouter } = require('./SuperAdminRouter/OperatorRouter');
const { ReportPassRouter } = require('./SuperAdminRouter/ReportPassRouter');
const { SellerRouter } = require('./SuperAdminRouter/SellerRouter');
const { ShiftRouter } = require('./SuperAdminRouter/ShiftRouter');
const { VehicleRateRouter } = require('./SuperAdminRouter/VehicleRateRouter');
const { VehicleRouter } = require('./SuperAdminRouter/VehicleRouter');
const { View_transRouter } = require('./SuperAdminRouter/View_transRouter');

SuperAdminRouter.use(LocationRouter);
SuperAdminRouter.use(SellerRouter);
SuperAdminRouter.use(CustomerRouter);
SuperAdminRouter.use(VehicleRouter);
SuperAdminRouter.use(OperatorRouter);
SuperAdminRouter.use(VehicleRateRouter);
SuperAdminRouter.use(Header_FooterRouter);
SuperAdminRouter.use(ShiftRouter);
SuperAdminRouter.use(ReportPassRouter);
SuperAdminRouter.use(DeviceSettingRouter);
SuperAdminRouter.use(View_transRouter);
SuperAdminRouter.use(GstRouter);

module.exports = {SuperAdminRouter}