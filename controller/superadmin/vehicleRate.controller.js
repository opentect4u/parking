const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");
const { getAllCustomerList } = require("./customer.controller");
const { getAllSellerList } = require("./seller.controller");
const { getAllVehicleList } = require("./vehicle.controller");

const getAllVehicleRateList = (id = 0) => {
    return new Promise(async (resolve, reject) => {
        var vehicle_rate = await db_Select('seller_id,customer_id,rate_type,vehicle_id,from_hour,to_hour,vehicle_rate,rate_flag,night_day_flag','md_rate_dtls', id > 0 ? `vehicle_id = ${id}` : null, null);
        resolve(vehicle_rate)
    })
};

const vehicle_rate = async(req,res) =>{
    try {
        var method = req.method
        var selected = {
          cust_id: method == 'POST' ? req.body.cust_name : '',
          veh_name: method == 'POST' ? req.body.veh_id : '',
          rate_type:  method == 'POST' ? req.body.rate_type : '',
          veh_id:  method == 'POST' ? req.body.veh_id : '',
        }
        console.log(selected,'pp');
        var cust = await getAllCustomerList()
        var seller_name = await getAllSellerList()
        var vehicle = await getAllVehicleList()
          veh_rate_list = [];
        if(method == 'POST'){
          veh_rate_list = await show_vehicle_rate_dtls(selected.cust_id,selected.veh_name)
          veh_rate_list = veh_rate_list.suc > 0 ? veh_rate_list.msg : []
        }

        const page_data = {
          title: "Vehicle Rate details",
          page_path: "super_admin/vehicle_rate/vehicle_rate",
          data: veh_rate_list,
          customer: cust.suc > 0 ? cust.msg : null,
          seller: seller_name.suc > 0 ? seller_name.msg : null,
          vehicle: vehicle.suc > 0 ? vehicle.msg : null,
          selected
        };
        console.log(cust,'999');
        res.render("common/layouts/main",page_data);
        console.log(page_data,'...');
      } catch (error) {
        console.log(error);
        res.redirect("/superadmin_login");
      }
};

const show_vehicle_rate_dtls = (cust_id,veh_name) => {
    return new Promise(async (resolve, reject) => {
      let select = "a.*,b.*",
        table_name = "md_rate_dtls a, md_seller b",
        whr = `a.seller_id = b.seller_id AND a.customer_id=${cust_id} AND a.vehicle_id = ${veh_name}`;
      const vehicle_dt = await db_Select(select, table_name, whr, null);
      resolve(vehicle_dt)
    })
  };

  const get_vehicle = async (req, res) => {
    var data = req.body;
    console.log(data, "1000");
    var select = "*",
      table_name = "md_vehicle",
      where = `customer_id = '${data.cust_id}'`;
    var veh_id = await db_Select(select, table_name, where, null);
    console.log(veh_id, "lalala");
    res.json({
      SUCCESS: { veh_id },
      status: true,
    });
  };
  
  const save_add_vehicle_rate = async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.required(),
        sell_id: Joi.required(),
        cust_name: Joi.optional(),
        cust_id: Joi.optional(),
        rate_type: Joi.required(),
        veh_id: Joi.required(),
        frm_hr: Joi.required(),
        to_hr: Joi.required(),
        park_fee: Joi.required(),
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      console.log(value);
      if (error) {
        const errors = {};
        error.details.forEach((detail) => {
          errors[detail.context.key] = detail.message;
        });
        return res.json({ error: errors });
      }
      var user_name = req.session.user.userData.user_name;
      const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  
      let fields = value.id > 0 ? `seller_id='${value.sell_id}',rate_type='${value.rate_type}',vehicle_id='${value.veh_id}',from_hour='${value.frm_hr}',to_hour='${value.to_hr}',vehicle_rate='${value.park_fee}',updated_by='${user_name}',updated_at='${datetime}'` : "(seller_id,customer_id,rate_type,vehicle_id,from_hour,to_hour,vehicle_rate,rate_flag,night_day_flag,created_by,created_at)",
        values = `('${value.sell_id}','${value.cust_name}','${value.rate_type}','${value.veh_id}','${value.frm_hr}','${value.to_hr}','${value.park_fee}','F','O','${user_name}','${datetime}')`;
      let res_dt = await db_Insert("md_rate_dtls", fields, values, value.id > 0 ? `sl_no=${value.id} AND customer_id = ${value.cust_id}` : null, value.id > 0 ? 1 : 0);
      console.log("========vehicle==========", res_dt);
      req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
      res.redirect("/superadmin/vehicle_rate");
    //   res.send(res_dt)
    } catch (error) {
      console.log(error);
      req.flash("error", value.id > 0 ? "Data not updated Successfully" : "Data not saved Successfully");
      res.redirect("/superadmin/vehicle_rate");
    }
  };  

module.exports = {vehicle_rate,show_vehicle_rate_dtls,get_vehicle,save_add_vehicle_rate}
