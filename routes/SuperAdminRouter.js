const SuperAdminRouter = require('express').Router()

const { CustomerRouter } = require('./SuperAdminRouter/CustomerRouter');
const { LocationRouter } = require('./SuperAdminRouter/LocationRouter');
const { OperatorRouter } = require('./SuperAdminRouter/OperatorRouter');
const { SellerRouter } = require('./SuperAdminRouter/SellerRouter');
const { VehicleRouter } = require('./SuperAdminRouter/VehicleRouter');

SuperAdminRouter.use(LocationRouter);
SuperAdminRouter.use(SellerRouter);
SuperAdminRouter.use(CustomerRouter);
SuperAdminRouter.use(VehicleRouter);
SuperAdminRouter.use(OperatorRouter);

module.exports = {SuperAdminRouter}