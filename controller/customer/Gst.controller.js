const Joi = require('joi');
const dateFormat = require("dateformat");
const { db_Insert, db_Select, db_Check } = require('../../model/Master.model');
const bcrypt = require("bcrypt");
const logger = require('../../model/LoggerModel');

const gst_dtls = async (req, res) => {
    try {
      var custId = req.session.user.user_data.customer_id;
      var select = "a.*,b.customer_name",
      table_name = "md_gst a, md_customer b",
      where = `a.customer_id = b.customer_id AND a.customer_id = '${custId}'`;
      var gst = await db_Select(select, table_name, where, null);
      const page_data = {
        title: "Show gst",
        page_path: "/gst/show_gst",
        data: gst,
      };
    //   console.log(data);
      res.render("common/layouts/main", page_data);
    } catch (error) {
      res.redirect("/login");
    }
  };

  const add_gst = async (req, res) => {
    try {
      const schema = Joi.object({
        gst_num: Joi.required(),
        cgst: Joi.required(),
        sgst: Joi.string(),
        total_gst: Joi.string(),
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

        const fields = "(customer_id,gst_flag,gst_type,gst_number,total_gst,cgst,sgst,created_by,created_at)",
        values = `('${custId}','Y','I','${value.gst_num}','${value.total_gst}','${value.cgst}','${value.sgst}','${custId}','${datetime}')`
        whr = null,
        flag = 0;
    var res_dt = await db_Insert("md_gst", fields, values, whr , flag);

    // console.log("========gst==========", res_dt);
    req.flash("success", "Saved successful");
    res.redirect("/gst/show_gst");
       
    } catch (error) {
      console.log(error);
      logger.error(err); // Log the error
      req.flash("error", "Data not saved Successfully");
      res.redirect("/gst/show_gst");
    }
  };

  const edit_gst_show = async (req, res) => {
    try {
      var data = req.query;
      var custId = req.session.user.user_data.customer_id;
      var select = "*",
      table_name = "md_gst",
      where = `customer_id = '${custId}' AND gst_id = '${data.gst_id}'`;
      var edit_gst = await db_Select(select, table_name, where, null);
      const page_data = {
        title: "Edit GST",
        page_path: "/gst/edit_gst",
        data: edit_gst,
      };
    //   console.log(data);
      res.render("common/layouts/main", page_data);
    } catch (error) {
      res.redirect("/login");
    }
  };

  const edit_save_gst = async (req, res) => {
    try {
      const schema = Joi.object({
        gst_num: Joi.required(),
        cgst: Joi.required(),
        sgst: Joi.string(),
        gst_id: Joi.string(),
        total_gst: Joi.string(),
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      console.log(value,'kkk');
      if (error) {
        const errors = {};
        error.details.forEach((detail) => {
          errors[detail.context.key] = detail.message;
        });
        return res.json({ error: errors });
      }
  
      const datetime = dateFormat(new Date(), "yyyy-mm-dd");
      var custId = req.session.user.user_data.customer_id;

  
      let fields =`gst_number='${value.gst_num}',total_gst='${value.total_gst}',cgst='${value.cgst}',sgst='${value.sgst}',updated_by = '${custId}',updated_at='${datetime}'`,
      where = `customer_id='${custId}' AND gst_id='${value.gst_id}'`
      var res_dt = await db_Insert("md_gst", fields, null, where, 1);

    //   console.log("========gstedit==========", res_dt);
      req.flash("success", "Updated successful");
      res.redirect("/gst/show_gst");
    } catch (error) {
    //   console.log(error);
      logger.error(err); // Log the error
      req.flash("error", "Data not updated Successfully");
      res.redirect("/gst/show_gst");
    }
  };

  module.exports = {gst_dtls, add_gst, edit_gst_show, edit_save_gst}