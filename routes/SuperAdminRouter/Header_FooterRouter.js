const { header_footer } = require('../../controller/superadmin/header_footer.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const Header_FooterRouter = require('express').Router();

Header_FooterRouter.all('/header_footer',AuthSuperCheckedMW,header_footer),


module.exports = { Header_FooterRouter}