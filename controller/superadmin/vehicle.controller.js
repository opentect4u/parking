const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");
const { getAllCustomerList } = require("./customer.controller");
const logger = require('../../model/LoggerModel');

const getAllVehicleList = (id = 0) => {
    return new Promise(async (resolve, reject) => {
        var vehicle = await db_Select('vehicle_id,customer_id,vehicle_name,vehicle_icon,vehicle_on_off','md_vehicle', id > 0 ? `vehicle_id = ${id}` : null, null);
        resolve(vehicle)
    })
};

const vehicle = async(req,res) =>{
    try {
      var method = req.method;
      var user = req.session.user;

      var selected = {
        // cust_id: method == 'POST' ? req.body.cust_name : ''
        cust_id: ""
      }

      var cust = await getAllCustomerList(),
        veh_list = [];

      if (user.userData.user_type === "S") {  
      selected.cust_id = method == "POST" ? req.body.cust_name : "";  
      if(method == 'POST' && selected.cust_id){
        veh_list = await show_vehicle_dtls(selected.cust_id)
        veh_list = veh_list.suc > 0 ? veh_list.msg : []
      }
     } else if (user.userData.user_type === "A") {
      // Admin → auto load operators for their customer_id
      selected.cust_id = user.userData.customer_id;
      veh_list = await show_vehicle_dtls(selected.cust_id)
      veh_list = veh_list.suc > 0 ? veh_list.msg : []
    }
        // var veh = await getAllVehicleList()
        const page_data = {
          title: "Vehicle details",
          page_path: "super_admin/vehicle/vehicle",
          data: veh_list,
          customer: cust.suc > 0 ? cust.msg : null,
          // veh: veh.suc > 0 ? veh.msg : [],
          selected
        };
        // console.log(data,'lolo');
        res.render("common/layouts/main",page_data);
      } catch (error) {
        // console.log(error);
        logger.error(err); // Log the error
        res.redirect("/superadmin_login");
      }
};

const show_vehicle_dtls = (cust_id) => {
  return new Promise(async (resolve, reject) => {
    let select = "*",
      table_name = "md_vehicle",
      whr = `customer_id=${cust_id}`;
    const vehicle_dt = await db_Select(select, table_name, whr, null);
    resolve(vehicle_dt)
  })
};

const vehicle_edit = async(req,res) =>{
  try {
    var data = req.query
      var vehicle_dt = await getAllVehicleList(data.id)
      var customer = await getAllCustomerList()
      const page_data = {
        id: data.id,
        customer_id: data.customer_id,
        title: "Vehicle Edit details",
        page_path: "/super_admin/vehicle/edit_vehicle",
        data: vehicle_dt.suc > 0 ? vehicle_dt.msg : null,
        customer: customer.suc > 0 ? customer.msg : null,
      };
      // console.log(page_data);
      res.render("common/layouts/main",page_data);
    } catch (error) {
      // console.log(error);
      logger.error(err); // Log the error
      res.redirect("/superadmin_login");
    }
};

const save_add_vehicle = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.required(),
      cust_name: Joi.optional(),
      cust_id: Joi.optional(),
      veh_name: Joi.required(),
      toggleActive: Joi.optional(),
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

    // ===== old data (for logging if update) =====
        let oldData = null;
        if (value.id > 0) {
          const existing_data = await db_Select(
            "*",
            "md_vehicle",
            `customer_id='${value.cust_id}' AND vehicle_id='${value.id}'`
          );
          oldData = existing_data.msg[0] || null;
        }

    let fields = value.id > 0 ? `vehicle_name='${value.veh_name}',vehicle_on_off='${
              value.toggleActive == "Y" ? "Y" : "N"
            }',updated_by='${user_name}',updated_at='${datetime}'` : "(customer_id,vehicle_name,created_by,created_at)",
      values = `('${value.cust_name}','${value.veh_name}','${user_name}','${datetime}')`;
    let res_dt = await db_Insert("md_vehicle", fields, values, value.id > 0 ? `vehicle_id=${value.id} AND customer_id = ${value.cust_id}` : null, value.id > 0 ? 1 : 0);
    // console.log("========vehicle==========", res_dt);

     // ===== Logging (common) =====
    if(oldData){
      // ---- Update log ----
      const changes = [];
       if (oldData.vehicle_name !== value.veh_name)
        changes.push(`vehicle_name: '${oldData.vehicle_name}' → '${value.veh_name}'`);
      if (oldData.vehicle_on_off !== (value.toggleActive == "Y" ? "Y" : "N"))
        changes.push(
          `vehicle_on_off: '${oldData.vehicle_on_off}' → '${value.toggleActive == "Y" ? "Y" : "N"}'`
        );

      logger.info(
        `${user_name} Updated Vehicle [CustID: ${value.cust_id}, ID: ${value.id}] Fields changed: ${changes.join(", ")}`
      );
    req.flash("success", "Updated successfully");
     } else {
      // ---- Create log with fields ----
      const createdFields = [
        `customer_id: '${value.cust_name}'`,
        `vehicle_name: '${value.veh_name}'`,
        // `vehicle_on_off: '${value.toggleActive == "Y" ? "Y" : "N"}'`,
      ];
      logger.info(
        `${user_name} Created Vehicle [CustID: ${value.cust_name}] Fields: ${createdFields.join(", ")}`
      );
      req.flash("success", "Saved successfully");
    }
    res.redirect("/superadmin/vehicle");
  //   res.send(res_dt)
  } catch (error) {
    // console.log(error);
    logger.error(error); // Log the error
    const isUpdate = req.body && req.body.id > 0;
    req.flash("error", isUpdate ? "Data not updated Successfully" : "Data not saved Successfully");
    res.redirect("/superadmin/vehicle");
  }
};


module.exports = {vehicle,show_vehicle_dtls,save_add_vehicle,vehicle_edit,getAllVehicleList}