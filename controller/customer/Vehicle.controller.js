const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");

const vehicle = async(req,res) =>{
    try {
        var custId = req.session.user.user_data.customer_id;
        var select = "a.*,b.customer_id,b.customer_name",
          table_name = "md_vehicle a, md_customer b",
          where = `a.customer_id = b.customer_id AND a.customer_id=${custId}`;
        var vehicle = await db_Select(select, table_name, where, null);
        // console.log(vehicle);
        const page_data = {
          title: "Vehicle details",
          page_path: "/vehicle_dtls/add_vehicle",
          data: vehicle,
        };
        res.render("common/layouts/main", page_data);
      } catch (error) {
        res.redirect("/login");
      }
};

const save_add_vehicle = async (req, res) => {
    try {
      const schema = Joi.object({
        cust_id: Joi.optional(),
        vehicle_name: Joi.required(),
        veh_flag: Joi.optional(),
        // vehicle_icon: Joi.required(),
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });
    //   console.log(value);
      if (error) {
        const errors = {};
        error.details.forEach((detail) => {
          errors[detail.context.key] = detail.message;
        });
        return res.json({ error: errors });
      }
  
      const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var custId = req.session.user.user_data.customer_id;
  
      console.log(value);
      let fields =
          "(customer_id,vehicle_name,vehicle_on_off,created_by,created_at)",
        values = `('${custId}','${value.vehicle_name}','Y','${custId}','${datetime}')`;
      let res_dt = await db_Insert("md_vehicle", fields, values, null, 0);
      console.log("========vehicle==========", res_dt);
      req.flash("success", "Saved successful");
      res.redirect("/vehicle/vehicle_details");
      // res.send(res_dt)
    } catch (error) {
      console.log(error);
      req.flash("error", "Data not saved Successfully");
      res.redirect("/vehicle/vehicle_details");
    }
  };

  const edit_vehicle = async (req, res) => {
    var data = req.query;
    // console.log(data,'lala');
    var custId = req.session.user.user_data.customer_id;
    let select = "a.*,b.customer_id,b.customer_name",
      table_name = "md_vehicle a, md_customer b",
      whr = `a.customer_id = b.customer_id AND a.customer_id='${custId}' AND a.vehicle_id='${data.vehicle_id}'`;
    const resData = await db_Select(select, table_name, whr, null);
    console.log(resData);
    delete resData.sql;
    var viewData = {
      title: "Vehicle",
      page_path: "/vehicle_dtls/edit_vehicle",
      data: resData.suc > 0 && resData.msg.length > 0 ? resData.msg[0] : [],
      customer_id: custId,
    };
    console.log(viewData,'12345');
    res.render("common/layouts/main", viewData);
  };

  const save_edit_vehicle = async (req, res) => {
    try {
      const schema = Joi.object({
        cust_id: Joi.string(),
        vehicle_id: Joi.string(),
        vehicle_name: Joi.optional(),
        veh_flag: Joi.optional(),
        // vehicle_icon: Joi.optional(),
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
  
      var custId = req.session.user.user_data.customer_id;
      const datetime = dateFormat(new Date(), "yyyy-mm-dd");
  
      let fields = `vehicle_id='${value.vehicle_id}',vehicle_name='${value.vehicle_name}',vehicle_on_off='${value.veh_flag== 'Y' ? 'Y' : 'N'}',updated_by='${custId}',updated_at='${datetime}'`,
        where = `customer_id='${custId}' AND vehicle_id='${value.vehicle_id}'`;
      let res_dt2 = await db_Insert("md_vehicle", fields, null, where, 1);
      // console.log(res_dt2);
      req.flash("success", "Updated successful");
      res.redirect("/vehicle/vehicle_details");
    } catch (error) {
      console.log(error);
      req.flash("error", "Data not Updated Successfully");
      res.redirect("/vehicle/vehicle_details");
    }
  };
 

module.exports = {vehicle,save_add_vehicle,edit_vehicle,save_edit_vehicle}