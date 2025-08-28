const SuperAdminRouter = require('express').Router()

const { CustomerRouter } = require('./SuperAdminRouter/CustomerRouter');
const { LocationRouter } = require('./SuperAdminRouter/LocationRouter');
const { SellerRouter } = require('./SuperAdminRouter/SellerRouter');

SuperAdminRouter.use(LocationRouter);
SuperAdminRouter.use(SellerRouter);
SuperAdminRouter.use(CustomerRouter);

module.exports = {SuperAdminRouter}