const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");
const bcrypt = require("bcrypt");
const logger = require('../../model/LoggerModel');
const { getAllCustomerList } = require("./customer.controller");

const show_admin_dtls = (cust_id) => {
    return new Promise(async (resolve, reject) => {
      let select = "*",
        table_name = "md_super_admin",
        whr = `customer_id=${cust_id}`;
      const admin_list = await db_Select(select, table_name, whr, null);
      // console.log(operator_dt,'111');
      resolve(admin_list)
    })
  };

const admin_details = async (req, res) => {
  try {
    var method = req.method
       var selected = {
         cust_id: method == 'POST' ? req.body.cust_name : ''
       }
        var cust = await getAllCustomerList(),
         admin_list = [];
         if(method == 'POST'){
               admin_list = await show_admin_dtls(selected.cust_id)
               console.log(admin_list,'admin');
               
               admin_list = admin_list.suc > 0 ? admin_list.msg : []
             }
    const page_data = {
      title: "Admin details",
      page_path: "/super_admin/admin/admin",
      data: admin_list,
      customer: cust.suc > 0 ? cust.msg : null,
      selected
    };
    res.render("common/layouts/main", page_data);
  } catch (error) {
    console.log(error);
    // logger.error(err); // Log the error
    res.redirect("/superadmin_login");
  }
};

const getAllAdminList = (id = 0,cust_id) => {
  return new Promise(async (resolve, reject) => {
      let select = "*",
      table_name = "md_super_admin",
      whr = `customer_id=${cust_id} ${id > 0 ? `AND sl_no = ${id}` : ''}`,
      order = null;
      var admin = await db_Select(select,table_name,whr,order);
      console.log(admin);
      resolve(admin)
  })
};

const admin_edit = async(req,res) =>{
    try {
      var data = req.query
      // console.log(data);
        var admin_dt = await getAllAdminList(data.id,data.customer_id)
        var cust = await getAllCustomerList()
        const page_data = {
          id: data.id,
          customer_id: data.customer_id,
          title: "Admin Edit details",
          page_path: "/super_admin/admin/edit_admin",
          data: admin_dt.suc > 0 ? admin_dt.msg : null,
          customer: cust.suc > 0 ? cust.msg : null,
        };
        // console.log(page_data);
        res.render("common/layouts/main",page_data);
      } catch (error) {
        // console.log(error);
        logger.error(err); // Log the error
        res.redirect("/superadmin_login");
      }
  };

  const add_edit_admin = async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.required(),
        cust_id: Joi.required(),
        user_id: Joi.required(),
        pass: Joi.required(),
        user_name: Joi.optional(),
        user_mobile_no: Joi.optional(),
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
      var password = bcrypt.hashSync(value.pass.toString(), 10);

  
      let fields = value.id > 0 ? `user_id='${value.user_id}',password='${password}',user_name='${value.user_name}',user_mobile_no='${value.user_mobile_no}',updated_by='${user_name}',updated_at='${datetime}'`: "(customer_id,user_type,user_id,password,user_name,user_mobile_no,allow_flag,created_by,created_at)",
      values = `('${value.cust_id}','A','${value.user_id}','${password}','${value.user_name}','${value.user_mobile_no}','Y','${user_name}','${datetime}')`;
      where = value.id > 0 ? `customer_id='${value.cust_id}' AND sl_no='${value.id}'` : null;
      flag = value.id > 0 ? 1 : 0 ;
      var res_dt = await db_Insert("md_super_admin", fields, values, where, flag);
      // console.log(res_dt,'222');
      req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
      res.redirect("/superadmin/admin");
    } catch (error) {
      // console.log(error);
      logger.error(err); // Log the error
      req.flash("error", value.id > 0 ? "Data not updated Successfully" : "Data not saved Successfully");
      res.redirect("/superadmin/admin");
    }
  };

module.exports = {admin_details,add_edit_admin, admin_edit}