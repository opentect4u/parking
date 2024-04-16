const { header_footer, header_footer_edit, header_footer_save } = require('../../controller/superadmin/header_footer.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const Header_FooterRouter = require('express').Router();

Header_FooterRouter.get('/header_footer',AuthSuperCheckedMW,header_footer),
Header_FooterRouter.get('/edit_header_footer',AuthSuperCheckedMW,header_footer_edit);
Header_FooterRouter.post('/save_header_footer',AuthSuperCheckedMW,header_footer_save);


module.exports = { Header_FooterRouter}