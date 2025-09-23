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
              //  console.log(admin_list,'admin');
               
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
      // console.log(admin);
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

  // const add_edit_admin = async (req, res) => {
  //   try {
  //     const schema = Joi.object({
  //       id: Joi.required(),
  //       cust_id: Joi.required(),
  //       user_id: Joi.required(),
  //       pass: Joi.required(),
  //       user_name: Joi.optional(),
  //       user_mobile_no: Joi.optional(),
  //     });
  //     const { error, value } = schema.validate(req.body, { abortEarly: false });
  //     console.log(value);
  //     if (error) {
  //       const errors = {};
  //       error.details.forEach((detail) => {
  //         errors[detail.context.key] = detail.message;
  //       });
  //       return res.json({ error: errors });
  //     }
  //     var user_name = req.session.user.userData.user_name;
  //     const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  //     var password = bcrypt.hashSync(value.pass.toString(), 10);
  
  //     let fields = value.id > 0 ? `user_id='${value.user_id}',password='${password}',user_name='${value.user_name}',user_mobile_no='${value.user_mobile_no}',updated_by='${user_name}',updated_at='${datetime}'`: "(customer_id,user_type,user_id,password,user_name,user_mobile_no,allow_flag,created_by,created_at)",
  //     values = `('${value.cust_id}','A','${value.user_id}','${password}','${value.user_name}','${value.user_mobile_no}','Y','${user_name}','${datetime}')`;
  //     where = value.id > 0 ? `customer_id='${value.cust_id}' AND sl_no='${value.id}'` : null;
  //     flag = value.id > 0 ? 1 : 0 ;
  //     var res_dt = await db_Insert("md_super_admin", fields, values, where, flag);
  //     req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
  //     res.redirect("/superadmin/admin");
  //   } catch (error) {
  //     logger.error(err);
  //     req.flash("error", value.id > 0 ? "Data not updated Successfully" : "Data not saved Successfully");
  //     res.redirect("/superadmin/admin");
  //   }
  // };

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

       // get old data if editing
        let oldData = null;
        if (value.id > 0) {
          const existing = await db_Select(
            "*",
            "md_super_admin",
            `customer_id='${value.cust_id}' AND sl_no='${value.id}'`
          );
          oldData = existing.msg[0] || null;
         }
  
      let fields = value.id > 0 ? `user_id='${value.user_id}',password='${password}',user_name='${value.user_name}',user_mobile_no='${value.user_mobile_no}',updated_by='${user_name}',updated_at='${datetime}'`: "(customer_id,user_type,user_id,password,user_name,user_mobile_no,allow_flag,created_by,created_at)",
      values = `('${value.cust_id}','A','${value.user_id}','${password}','${value.user_name}','${value.user_mobile_no}','Y','${user_name}','${datetime}')`;
      where = value.id > 0 ? `customer_id='${value.cust_id}' AND sl_no='${value.id}'` : null;
      flag = value.id > 0 ? 1 : 0 ;
      var res_dt = await db_Insert("md_super_admin", fields, values, where, flag);

       // ===== Logging (common) =====
      if (oldData) {
        // ---- Update log ----
      const changes = [];
      if (oldData.user_id !== value.user_id)
        changes.push(`user_id: '${oldData.user_id}' → '${value.user_id}'`);
      if (oldData.user_name !== value.user_name)
        changes.push(`user_name: '${oldData.user_name}' → '${value.user_name}'`);
      if (oldData.user_mobile_no !== value.user_mobile_no)
        changes.push(
          `user_mobile_no: '${oldData.user_mobile_no}' → '${value.user_mobile_no}'`
        );
      if (value.pass) changes.push("password: [updated]");

      logger.info(
        `${user_name} Updated Admin [CustID: ${value.cust_id}, ID: ${value.id}] Fields changed: ${changes.join(", ")}`
      );
      // req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
      req.flash("success", "Updated successfully");
       } else {
        // ---- Create log with fields ----
      const createdFields = [
        `customer_id: '${value.cust_id}'`,
        `user_id: '${value.user_id}'`,
        `user_name: '${value.user_name}'`,
        `user_mobile_no: '${value.user_mobile_no}'`,
        "password: [created]",
      ];
      logger.info(
      //   `${user_name} Created Admin [CustID: ${value.cust_id}] [UserID: ${value.user_id}]`
      // );
      `${user_name} Created Admin [CustID: ${value.cust_id}] Fields: ${createdFields.join(
          ", "
        )}`
      );
      req.flash("success", "Saved successfully");
      }
      res.redirect("/superadmin/admin");
    } catch (error) {
      logger.error(error);
      const isUpdate = req.body && req.body.id > 0;
      req.flash("error", isUpdate ? "Data not updated Successfully" : "Data not saved Successfully");
      res.redirect("/superadmin/admin");
    }
  };

module.exports = {admin_details,add_edit_admin, admin_edit}