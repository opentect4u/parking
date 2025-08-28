const { gst, save_add_gst, edit_gst, edit_save_gst_sa, gst_edit } = require('../../controller/superadmin/gst.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');

const GstRouter = require('express').Router();

GstRouter.get('/gst',AuthSuperCheckedMW,gst);
GstRouter.get('/edit_gst',AuthSuperCheckedMW,gst_edit);
GstRouter.post('/gst_save',AuthSuperCheckedMW,save_add_gst);
module.exports = {GstRouter}