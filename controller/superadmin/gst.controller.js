const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");
const logger = require('../../model/LoggerModel');
const { getAllCustomerList } = require("./customer.controller");

const getAllGSTList = (id = 0, cust_id) => {
  return new Promise(async (resolve, reject) => {
    var gst_dt = await db_Select(
      "*",
      "md_gst",
      id > 0 ? `customer_id = ${cust_id} AND gst_id = ${id}` : null,
      null
    );
    resolve(gst_dt);
  });
};

const gst = async (req, res) => {
  try {
      var cust = await getAllCustomerList()
      var gst_dt = await show_gst_dtls()
    const page_data = {
      title: "GST details",
      page_path: "super_admin/gst/add_gst",
      data: gst_dt,
      customer: cust.suc > 0 ? cust.msg : null,
    };
    console.log(data, "999");
    res.render("common/layouts/main", page_data);
  } catch (error) {
    // console.log(error);
    logger.error(err); 
    res.redirect("/superadmin_login");
  }
};

const show_gst_dtls = () => {
  return new Promise(async (resolve, reject) => {
    let select = "a.*, b.customer_name",
      table_name = "md_gst a, md_customer b",
      whr = `a.customer_id = b.customer_id`;
    const gst_dt = await db_Select(select, table_name, whr, null);
    resolve(gst_dt);
  });
};

const gst_edit = async(req,res) =>{
  try {
    var data = req.query
    console.log(data,'dadada');
    
      var gst_dt = await getAllGSTList(data.id,data.customer_id)
      var cust = await getAllCustomerList()
      const page_data = {
        id: data.id,
        customer_id: data.customer_id,
        title: "GST Edit details",
        page_path: "/super_admin/gst/edit_gst",
        data: gst_dt.suc > 0 ? gst_dt.msg : null,
        customer: cust.suc > 0 ? cust.msg : null,
      };
      // console.log(page_data,'ll');
      res.render("common/layouts/main",page_data);
    } catch (error) {
      // console.log(error);
      logger.error(err); // Log the error
      res.redirect("/superadmin_login");
    }
};

const save_add_gst = async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.optional(),
        cust_name: Joi.optional(),
        cust_id: Joi.optional(),
        gst_num: Joi.required(),
        cgst: Joi.required(),
        sgst: Joi.string(),
        total_gst: Joi.string(),
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      console.log(value,'popo');
      if (error) {
        const errors = {};
        error.details.forEach((detail) => {
          errors[detail.context.key] = detail.message;
        });
        return res.json({ error: errors });
      }
  
      const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

        const fields = value.id > 0 ? `gst_number = '${value.gst_num}', total_gst = '${value.total_gst}', cgst = '${value.cgst}', sgst = '${value.sgst}', updated_by = '${value.cust_id}', updated_at = '${datetime}'` : "(customer_id,gst_flag,gst_type,gst_number,total_gst,cgst,sgst,created_by,created_at)",
        values = `('${value.cust_name}','Y','I','${value.gst_num}','${value.total_gst}','${value.cgst}','${value.sgst}','${value.cust_name}','${datetime}')`
        whr = value.id > 0 ? `customer_id='${value.cust_id}' AND gst_id='${value.id}'` : null,
        flag = value.id > 0 ? 1 : 0;
    var res_dt = await db_Insert("md_gst", fields, values, whr , flag);

    // console.log("========gst==========", res_dt);
    req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
    res.redirect("/superadmin/gst");
       
    } catch (error) {
      console.log(error);
      logger.error(err); // Log the error
      req.flash("error", value.id > 0 ? "Data not updated Successfully" : "Data not saved Successfully");
      res.redirect("/superadmin/gst");
    }
  };   

  module.exports = {gst, save_add_gst, gst_edit}