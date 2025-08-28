const { gst_dtls, add_gst, edit_gst_show, edit_save_gst } = require('../controller/customer/Gst.controller');
const { AuthCheckedMW } = require('../middleware/AuthChecked.middleware');
const gstRouter = require('express').Router();

gstRouter.get('/show_gst',AuthCheckedMW,gst_dtls);
gstRouter.post('/save_add_gst',AuthCheckedMW,add_gst);
gstRouter.get('/gst_edit',AuthCheckedMW,edit_gst_show);
gstRouter.post('/save_edit_gst',AuthCheckedMW,edit_save_gst);

module.exports = {gstRouter}
