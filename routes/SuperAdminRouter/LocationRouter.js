const { locations, save_add_location, locations_edit } = require('../../controller/superadmin/location.controller')
const { AuthSuperCheckedMW } = require('../../middleware/AuthChecked.middleware')

const LocationRouter = require('express').Router()

LocationRouter.get('/location',AuthSuperCheckedMW,locations);
LocationRouter.get('/edit_location',AuthSuperCheckedMW,locations_edit);
LocationRouter.post('/location_save',AuthSuperCheckedMW,save_add_location);

module.exports = {LocationRouter}