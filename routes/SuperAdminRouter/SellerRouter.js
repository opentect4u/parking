const { seller, save_add_seller, seller_edit } = require('../../controller/superadmin/seller.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const SellerRouter = require('express').Router();

SellerRouter.get('/seller',AuthSuperCheckedMW,seller);
SellerRouter.get('/edit_seller',AuthSuperCheckedMW,seller_edit);
SellerRouter.post('/seller_add',AuthSuperCheckedMW,save_add_seller);

module.exports = {SellerRouter}