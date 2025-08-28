const SuperAdminRouter = require('express').Router()

const { CustomerRouter } = require('./SuperAdminRouter/CustomerRouter');
const { Header_FooterRouter } = require('./SuperAdminRouter/Header_FooterRouter');
const { LocationRouter } = require('./SuperAdminRouter/LocationRouter');
const { OperatorRouter } = require('./SuperAdminRouter/OperatorRouter');
const { SellerRouter } = require('./SuperAdminRouter/SellerRouter');
const { VehicleRateRouter } = require('./SuperAdminRouter/VehicleRateRouter');
const { VehicleRouter } = require('./SuperAdminRouter/VehicleRouter');

SuperAdminRouter.use(LocationRouter);
SuperAdminRouter.use(SellerRouter);
SuperAdminRouter.use(CustomerRouter);
SuperAdminRouter.use(VehicleRouter);
SuperAdminRouter.use(OperatorRouter);
SuperAdminRouter.use(VehicleRateRouter);
SuperAdminRouter.use(Header_FooterRouter);

module.exports = {SuperAdminRouter}