const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");

const customer = async (req, res) => {
  try {
    var custId = req.session.user.user_data.customer_id;
    var select = "a.*,b.*",
      table_name = "md_receipt_setting a, md_customer b",
      where = `a.customer_id = b.customer_id AND a.customer_id=${custId}`;
    var customer = await db_Select(select, table_name, where, null);
    const page_data = {
      title: "header_customer",
      page_path: "/header_footer/header_footer",
      data: customer,
    };
    res.render("common/layouts/main", page_data);
  } catch (error) {
    res.redirect("/login");
  }
};

const show_header_footer = async (req, res) => {
  try {
    var custId = req.session.user.user_data.customer_id;
    let select = "a.*,b.*",
      table_name = "md_receipt_setting a, md_customer b",
      whr = `a.customer_id = b.customer_id AND a.customer_id=${custId}`;
    const customer = await db_Select(select, table_name, whr, null);
    res.json(customer);
  } catch (error) {
    res.json({
      suc: 0,
      msg: [],
    });
  }
};

const edit_header_footer = async (req, res) => {
  var custId = req.session.user.user_data.customer_id;
  let select = "a.*,b.*",
    table_name = "md_receipt_setting a, md_customer b",
    whr = `a.customer_id = b.customer_id AND a.customer_id=${custId}`;
  const resData = await db_Select(select, table_name, whr, null);
  // console.log(resData);
  delete resData.sql;
  var viewData = {
    title: "Header_Footer",
    page_path: "/header_footer/edit_header_footer",
    data: resData.suc > 0 && resData.msg.length > 0 ? resData.msg[0] : [],
    customer_id: custId,
  };
  // console.log(viewData);
  res.render("common/layouts/main", viewData);
};

const add_header_footer = async (req, res) => {
  try {
    const schema = Joi.object({
      cust_id: Joi.required(),
      header_1: Joi.required(),
      header_1_flag: Joi.string(),
      header_2: Joi.required(),
      header_2_flag: Joi.string(),
      header_3: Joi.required(),
      header_3_flag: Joi.string(),
      header_4: Joi.required(),
      header_4_flag: Joi.string(),
      footer_1: Joi.required(),
      footer_1_flag: Joi.string(),
      footer_2: Joi.required(),
      footer_2_flag: Joi.string(),
      footer_3: Joi.required(),
      footer_3_flag: Joi.string(),
      footer_4: Joi.required(),
      footer_4_flag: Joi.string(),
      in_on_off_flag: Joi.string(),
      out_on_off_flag: Joi.string(),
      report_flag: Joi.string(),
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

    // console.log(value)
    let fields =
        "(customer_id,header1,header1_flag,header2,header2_flag,header3,header3_flag,header4,header4_flag,footer1,footer1_flag,footer2,footer2_flag,footer3,footer3_flag,footer4,footer4_flag,IN_on_off,OUT_on_off,report_flag,created_at)",
      values = `('${custId}','${value.header_1}','${
        value.header_1_flag == 1 ? 1 : 0
      }','${value.header_2}','${value.header_2_flag == 1 ? 1 : 0}','${
        value.header_3
      }','${value.header_3_flag == 1 ? 1 : 0}','${value.header_4}','${
        value.header_4_flag == 1 ? 1 : 0
      }','${value.footer_1}','${value.footer_1_flag == 1 ? 1 : 0}','${
        value.footer_2
      }','${value.footer_2_flag == 1 ? 1 : 0}','${value.footer_3}','${
        value.footer_3_flag == 1 ? 1 : 0
      }','${value.footer_4}','${
        value.footer_4_flag == 1 ? 1 : 0
      }','${
        value.in_on_off_flag == 'Y' ? 'Y' : 'N'
      }','${
        value.out_on_off_flag == 'Y' ? 'Y' : 'N'
      }','${
        value.report_flag == 'Y' ? 'Y' : 'N'
      }','${datetime}')`;
    let res_dt = await db_Insert("md_receipt_setting", fields, values, null, 0);
    // console.log("========header==========", res_dt);
    req.flash("success", "Saved successful");
    res.redirect("/header/customer_name");
    // res.send(res_dt)
  } catch (error) {
    // console.log(error);
    req.flash("error", "Data not saved Successfully");
    res.redirect("/header/customer_name");
  }
};

const edit_save_header_footer = async (req, res) => {
  try {
    const schema = Joi.object({
      cust_id: Joi.required(),
      header_1: Joi.required(),
      header_1_flag: Joi.string(),
      header_2: Joi.required(),
      header_2_flag: Joi.string(),
      header_3: Joi.required(),
      header_3_flag: Joi.string(),
      header_4: Joi.required(),
      header_4_flag: Joi.string(),
      footer_1: Joi.required(),
      footer_1_flag: Joi.string(),
      footer_2: Joi.required(),
      footer_2_flag: Joi.string(),
      footer_3: Joi.required(),
      footer_3_flag: Joi.string(),
      footer_4: Joi.required(),
      footer_4_flag: Joi.string(),
      in_on_off_flag: Joi.string(),
      out_on_off_flag: Joi.string(),
      report_flag: Joi.string(),

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

    let fields = `header1='${value.header_1}',header1_flag='${
        value.header_1_flag == 1 ? 1 : 0
      }',header2='${value.header_2}',header2_flag='${
        value.header_2_flag == 1 ? 1 : 0
      }',header3='${value.header_3}',header3_flag='${
        value.header_3_flag == 1 ? 1 : 0
      }',header4='${value.header_4}',header4_flag='${
        value.header_4_flag == 1 ? 1 : 0
      }',footer1='${value.footer_1}',footer1_flag='${
        value.footer_1_flag == 1 ? 1 : 0
      }',footer2='${value.footer_2}',footer2_flag='${
        value.footer_2_flag == 1 ? 1 : 0
      }',footer3='${value.footer_3}',footer3_flag='${
        value.footer_3_flag == 1 ? 1 : 0
      }',footer4='${value.footer_4}',footer4_flag='${
        value.footer_4_flag == 1 ? 1 : 0
      }',IN_on_off='${
        value.in_on_off_flag == 'Y' ? 'Y' : 'N'
      }',OUT_on_off='${
        value.out_on_off_flag == 'Y' ? 'Y' : 'N'
      }',report_flag='${
        value.report_flag == 'Y' ? 'Y' : 'N'
      }',updated_at='${datetime}'`,
      where = `customer_id='${value.cust_id}'`;
    let res_dt2 = await db_Insert("md_receipt_setting", fields, null, where, 1);
    // console.log(res_dt2);
    req.flash("success", "Updated successful");
    res.redirect("/header/customer_name");
  } catch (error) {
    // console.log(error);
    req.flash("error", "Data not Updated Successfully");
    res.redirect("/header/customer_name");
  }
};

module.exports = {
  customer,
  show_header_footer,
  edit_header_footer,
  add_header_footer,
  edit_save_header_footer,
};
