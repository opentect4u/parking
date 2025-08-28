const Joi = require('joi');
const dateFormat = require("dateformat");
const { db_Insert, db_Select } = require('../../model/Master.model');
const bcrypt = require("bcrypt");


const operator = async (req, res) => {
    try {
      var custId = req.session.user.user_data.customer_id;
      var select = "a.*,b.*,c.*,d.*",
      table_name = "md_operator a, md_user b, md_seller c, md_locations d",
      where = `a.customer_id = b.customer_id
      AND a.location_id = d.location_id
      AND a.user_id = b.user_id
      AND b.seller_id = c.seller_id
      AND a.customer_id = '${custId}' AND b.user_type = 'O'`;
      var operator = await db_Select(select, table_name, where, null);
      const page_data = {
        title: "Add customer",
        page_path: "/manage_operator/add_operator",
        data: operator,
      };
      // console.log(data);
      res.render("common/layouts/main", page_data);
    } catch (error) {
      res.redirect("/login");
    }
  };

  const edit_operator_show = async (req, res) => {
    try {
      var data = req.query;
      var custId = req.session.user.user_data.customer_id;
      var select = "a.*,b.*,c.*,d.*",
      table_name = "md_operator a, md_user b, md_seller c, md_locations d",
      where = `a.customer_id = b.customer_id
      AND a.location_id = d.location_id
      AND a.user_id = b.user_id
      AND b.seller_id = c.seller_id
      AND a.customer_id = '${custId}' AND b.user_type = 'O' AND a.user_id='${data.user_id}'`;
      var operator = await db_Select(select, table_name, where, null);
      const page_data = {
        title: "Edit Operator",
        page_path: "/manage_operator/edit_operator",
        data: operator,
      };
      // console.log(data);
      res.render("common/layouts/main", page_data);
    } catch (error) {
      res.redirect("/login");
    }
  };

  const add_operator = async (req, res) => {
    try {
      const schema = Joi.object({
        op_name: Joi.required(),
        mob_no: Joi.required(),
        dev_id: Joi.string(),
        pwd: Joi.required(),
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
  
      const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var custId = req.session.user.user_data.customer_id;
      var locationId = req.session.user.user_data.location_id;
      var sellerId = req.session.user.user_data.seller_id;
      var password = bcrypt.hashSync(value.pwd.toString(), 10);

      let fields =
          "(operator_name,user_id,customer_id,location_id,created_at)",
        values = `('${value.op_name}','${value.mob_no}','${custId}','${locationId}','${datetime}')`;
      var res_dt = await db_Insert("md_operator", fields, values, null, 0);

      if(res_dt.suc > 0){
        let fields_1 =
        "(customer_id,seller_id,user_type,password,device_id,user_id,allow_flag,created_at)",
      values_1 = `('${custId}','${sellerId}','O','${password}','${value.dev_id}','${value.mob_no}','Y','${datetime}')`;
    var res_dt_2 = await db_Insert("md_user", fields_1, values_1, null, 0);
     }
      // console.log("========operator==========", res_dt);
      req.flash("success", "Saved successful");
      res.redirect("/operator/manage_operator");
    } catch (error) {
      console.log(error);
      req.flash("error", "Data not saved Successfully");
      res.redirect("/operator/manage_operator");
    }
  };

  const edit_save_operator = async (req, res) => {
    try {
      const schema = Joi.object({
        op_name: Joi.required(),
        mob_no: Joi.required(),
        dev_id: Joi.string(),
        pwd: Joi.required(),
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
  
      const datetime = dateFormat(new Date(), "yyyy-mm-dd");
      var custId = req.session.user.user_data.customer_id;
      var locationId = req.session.user.user_data.location_id;
      var sellerId = req.session.user.user_data.seller_id;
      var password = bcrypt.hashSync(value.pwd.toString(), 10);

  
      let fields =`operator_name='${value.op_name}',user_id='${value.mob_no}',customer_id='${custId}',location_id='${locationId}',updated_at='${datetime}'`,
      where = `customer_id='${custId}' AND user_id='${value.mob_no}'`
      var res_dt = await db_Insert("md_operator", fields, null, where, 1);

      if(res_dt.suc > 0){
        let fields_1 =`customer_id='${custId}',seller_id='${sellerId}',user_type='O',password='${password}',device_id='${value.dev_id}',user_id='${value.mob_no}',allow_flag='Y',updated_at='${datetime}'`,
     where1 = `customer_id='${custId}'AND user_id='${value.mob_no}'`
    var res_dt_2 = await db_Insert("md_user", fields_1, null, where1, 1);
     }
      // console.log("========operator==========", res_dt);
      req.flash("success", "Updated successful");
      res.redirect("/operator/manage_operator");
    } catch (error) {
      console.log(error);
      req.flash("error", "Data not updated Successfully");
      res.redirect("/operator/manage_operator");
    }
  };

  module.exports = {operator,edit_operator_show,add_operator,edit_save_operator}