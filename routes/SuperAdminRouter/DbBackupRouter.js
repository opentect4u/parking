const { db_bakup, download_csv_backup } = require('../../controller/superadmin/dbBackupController');
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware');
const dateFormat = require("dateformat");

const dbbackupRouter = require('express').Router();

dbbackupRouter.get('/db_backup',AuthSuperCheckedMW,db_bakup);
dbbackupRouter.post('/download_csv_backup',AuthSuperCheckedMW,download_csv_backup);

module.exports = {dbbackupRouter}