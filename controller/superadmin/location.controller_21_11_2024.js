const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");

const getAllLocationList = (id = 0) => {
    return new Promise(async (resolve, reject) => {
        var loca = await db_Select('location_id, loction','md_locations', id > 0 ? `location_id = ${id}` : null, null);
        resolve(loca)
    })
}

const locations = async(req,res) =>{
    try {
        var loca = await getAllLocationList()
        const page_data = {
          title: "Location details",
          page_path: "super_admin/locations/locations",
          data: loca,
        };
        // console.log(data);
        res.render("common/layouts/main",page_data);
      } catch (error) {
        // console.log(error);
        res.redirect("/superadmin_login");
      }
};

const locations_edit = async(req,res) =>{
  try {
    var data = req.query
      var location_dt = await getAllLocationList(data.id)
      const page_data = {
        id: data.id,
        title: "Location Edit details",
        page_path: "super_admin/locations/edit_locations",
        data: location_dt.suc > 0 ? location_dt.msg : null,
      };
      // console.log(data);
      res.render("common/layouts/main",page_data);
    } catch (error) {
      // console.log(error);
      // res.redirect("/superadmin_login");
    }
};

const save_add_location = async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.required(),
        loc_name: Joi.required(),
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      // console.log(value);
      if (error) {
        const errors = {};
        error.details.forEach((detail) => {
          errors[detail.context.key] = detail.message;
        });
        return res.json({ error: errors });
      }
      var user_name = req.session.user.userData.user_name;
      const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  
      let fields = value.id > 0 ? `loction='${value.loc_name}',updated_by='${user_name}',updated_at='${datetime}'` : "(loction,created_by,created_at)",
        values = `('${value.loc_name}','${user_name}','${datetime}')`;
      let res_dt = await db_Insert("md_locations", fields, values, value.id > 0 ? `location_id=${value.id}` : null, value.id > 0 ? 1 : 0);
      // console.log("========location==========", res_dt);
      req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
      res.redirect("/superadmin/location");
    //   res.send(res_dt)
    } catch (error) {
    //   console.log(error);
      req.flash("error", value.id > 0 ? "Data not updated Successfully" : "Data not saved Successfully");
      res.redirect("/superadmin/location");
    }
  };

module.exports = {locations,save_add_location,locations_edit,getAllLocationList}