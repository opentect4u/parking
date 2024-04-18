const Joi = require("joi");
const dateFormat = require("dateformat");
const { getAllCustomerList } = require("./customer.controller");
const { db_Select, db_Insert } = require("../../model/Master.model");
const bcrypt = require("bcrypt");


const getAllreportList = (id=0,cust_id) => {
    return new Promise(async (resolve, reject) => {
      var report_pass_list = await db_Select("setting_id,password,report_password_flag,customer_id","md_setting",
        `customer_id = ${cust_id} ${id > 0 ? `AND setting_id = ${id}` : ''}`,
        null
      );
    //   console.log(report_pass_list,'22');
      resolve(report_pass_list);
    });
  };

const report_password = async (req, res) => {
    try {
        var cust = await getAllCustomerList()
        var pass_report = await show_report_pass_dtls()
      const page_data = {
        title: "Report Password details",
        page_path: "super_admin/report_password/report_password",
        data: pass_report,
        customer: cust.suc > 0 ? cust.msg : null,
      };
      // console.log(page_data, "999");
      res.render("common/layouts/main", page_data);
    } catch (error) {
      // console.log(error);
      res.redirect("/superadmin_login");
    }
  };


  const show_report_pass_dtls = () => {
    return new Promise(async (resolve, reject) => {
      let select = "DISTINCT a.password,a.report_password_flag,a.customer_id,b.customer_name",
        table_name = "md_setting a, md_customer b",
        whr = `a.customer_id = b.customer_id`;
      const report_pass_dt = await db_Select(select, table_name, whr, null);
      resolve(report_pass_dt);
    });
  };  

  const edit_report_password = async (req, res) => {
    try {
        var data = req.query
        // console.log(data,';;;');
          var report_dt = await getAllreportList(0,data.customer_id)
          // console.log(report_dt, 'REPORT DETAILS');
          var cust = await getAllCustomerList()
          const page_data = {
            id: data.id,
            customer_id: data.customer_id,
            title: "Report Password Edit details",
            page_path: "/super_admin/report_password/edit_report_password",
            data: report_dt.suc > 0 ? report_dt.msg : null,
            customer: cust.suc > 0 ? cust.msg : null,
          };
          // console.log(page_data,'ll');
          res.render("common/layouts/main",page_data);
        } catch (error) {
          // console.log(error);
          res.redirect("/superadmin_login");
        }
  };

  const save_report_password = async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.optional(),
        cust_id: Joi.optional(),
        report_pwd: Joi.optional(),
        pwd: Joi.optional(),
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
      var password = bcrypt.hashSync(value.pwd, 10);

      var chk_sett = await db_Select('setting_id', 'md_setting', `customer_id = ${value.cust_id}`, null)
  
      let fields = chk_sett.suc > 0 && chk_sett.msg.length > 0 ? `report_password_flag='${value.report_pwd == 'Y' ? 'Y' : 'N'}',password='${value.report_pwd == 'Y' ? password : ''}',modified_by='${user_name}',updated_at='${datetime}'` : "(customer_id,report_password_flag,password,created_by,created_at)",
        values = `('${value.cust_id}','${value.report_pwd == 'Y' ? 'Y' : 'N'}','${value.report_pwd == 'Y' ? password : ''}','${user_name}','${datetime}')`;
      let res_dt = await db_Insert("md_setting", fields, values, chk_sett.suc > 0 && chk_sett.msg.length > 0 ? `customer_id = ${value.cust_id}` : null, chk_sett.suc > 0 && chk_sett.msg.length > 0 ? 1 : 0);
      // console.log("========shift==========", res_dt);
      req.flash("success", chk_sett.suc > 0 && chk_sett.msg.length > 0 ? "Updated successfully" : "Saved successfully");
      res.redirect("/superadmin/report_pass");
    //   res.send(res_dt)
    } catch (error) {
      // console.log(error);
      req.flash("error", value.id > 0 ? "Data not updated Successfully" : "Data not saved Successfully");
      res.redirect("/superadmin/report_pass");
    }
  }; 

module.exports = {report_password,show_report_pass_dtls,edit_report_password,getAllreportList,save_report_password}   