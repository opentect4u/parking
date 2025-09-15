const { admin, admin_details, add_edit_admin, admin_edit } = require('../../controller/superadmin/admin.controller');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');


const AdminRouter = require('express').Router();

AdminRouter.all('/admin',AuthSuperCheckedMW,admin_details);
AdminRouter.get('/edit_admin',AuthSuperCheckedMW,admin_edit);
AdminRouter.all('/save_admin',AuthSuperCheckedMW,add_edit_admin);


module.exports = {AdminRouter}