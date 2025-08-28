const Joi = require("joi");
const dateFormat = require("dateformat");
const { getAllCustomerList } = require("./customer.controller");
const { db_Select, db_Insert } = require("../../model/Master.model");
const logger = require('../../model/LoggerModel');

const getAllheaderfooterList = (id = 0,cust_id) => {
    return new Promise(async (resolve, reject) => {
      var header_footer_list = await db_Select("*","md_receipt_setting",
        id > 0 ? `customer_id = ${cust_id} AND receipt_setting_id = ${id}` : null,
        null
      );
      // console.log(vehicle_rate,'22');
      resolve(header_footer_list);
    });
  };

const header_footer = async (req, res) => {
    try {
        var cust = await getAllCustomerList()
        var head_foot = await show_header_footer_dtls()
      const page_data = {
        title: "Header Footer details",
        page_path: "super_admin/header_footer/header_footer",
        data: head_foot,
        customer: cust.suc > 0 ? cust.msg : null,
      };
      // console.log(page_data, "999");
      res.render("common/layouts/main", page_data);
    } catch (error) {
      // console.log(error);
      logger.error(err); // Log the error
      res.redirect("/superadmin_login");
    }
  };

  const show_header_footer_dtls = () => {
    return new Promise(async (resolve, reject) => {
      let select = "a.*, b.customer_name",
        table_name = "md_receipt_setting a, md_customer b",
        whr = `a.customer_id = b.customer_id`;
      const head_foot_dt = await db_Select(select, table_name, whr, null);
      resolve(head_foot_dt);
    });
  };

  const header_footer_edit = async(req,res) =>{
    try {
      var data = req.query
        var header_footer_dt = await getAllheaderfooterList(data.id,data.customer_id)
        var cust = await getAllCustomerList()
        const page_data = {
          id: data.id,
          customer_id: data.customer_id,
          title: "Header Footer Edit details",
          page_path: "/super_admin/header_footer/edit_header_footer",
          data: header_footer_dt.suc > 0 ? header_footer_dt.msg : null,
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

  const header_footer_save = async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.optional(),
        cust_id: Joi.optional(),
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
      var user_name = req.session.user.userData.user_name;
      const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  
      let fields = value.id > 0 ? `header1='${value.header_1}',header1_flag='${
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
      }',updated_by='${user_name}',updated_at='${datetime}'` : "(customer_id,header1,header2,header3,header4,footer1,footer2,footer3,footer4,IN_on_off,OUT_on_off,report_flag,header1_flag,header2_flag,header3_flag,header4_flag,footer1_flag,footer2_flag,footer3_flag,footer4_flag,created_by,created_at)",
        values = `('${value.cust_id}','${value.header_1}','${value.header_2}','${value.header_3}','${value.header_4}','${value.footer_1}','${value.footer_2}','${value.footer_3}','${value.footer_4}','${
          value.in_on_off_flag == 'Y' ? 'Y' : 'N'
        }','${
          value.out_on_off_flag == 'Y' ? 'Y' : 'N'
        }','${
          value.report_flag == 'Y' ? 'Y' : 'N'
        }','${
          value.header_1_flag == 1 ? 1 : 0
        }','${value.header_2_flag == 1 ? 1 : 0}','${value.header_3_flag == 1 ? 1 : 0}','${
          value.header_4_flag == 1 ? 1 : 0
        }','${value.footer_1_flag == 1 ? 1 : 0}','${value.footer_2_flag == 1 ? 1 : 0}','${
          value.footer_3_flag == 1 ? 1 : 0
        }','${
          value.footer_4_flag == 1 ? 1 : 0
        }','${user_name}','${datetime}')`;
      let res_dt = await db_Insert("md_receipt_setting", fields, values, value.id > 0 ? `customer_id='${value.cust_id}' AND receipt_setting_id='${value.id}'` : null, value.id > 0 ? 1 : 0);
      // console.log("========location==========", res_dt);
      req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
      res.redirect("/superadmin/header_footer");
    //   res.send(res_dt)
    } catch (error) {
      // console.log(error);
      logger.error(err); // Log the error
      req.flash("error", value.id > 0 ? "Data not updated Successfully" : "Data not saved Successfully");
      res.redirect("/superadmin/header_footer");
    }
  };

  module.exports = {header_footer,show_header_footer_dtls,header_footer_edit,header_footer_save}