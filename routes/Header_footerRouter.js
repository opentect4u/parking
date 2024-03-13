const express = require('express');
const { AuthCheckedMW } = require('../middleware/AuthChecked.middleware');
const { customer, show_header_footer, edit_header_footer, add_header_footer, edit_save_header_footer } = require('../controller/customer/Header_footer.controller');
const Header_footerRouter = express.Router()
dateFormat = require('dateformat');

Header_footerRouter.get('/customer_name',AuthCheckedMW,customer);
Header_footerRouter.get('/header_footer_details',AuthCheckedMW,show_header_footer);
Header_footerRouter.get('/edit_header_footer_details',AuthCheckedMW,edit_header_footer);
Header_footerRouter.post('/add_header_footer',AuthCheckedMW,add_header_footer);
Header_footerRouter.post('/edit_save_header_footer',AuthCheckedMW,edit_save_header_footer)



module.exports = { Header_footerRouter}