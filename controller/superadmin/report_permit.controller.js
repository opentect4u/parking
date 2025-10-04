const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");
const { getAllCustomerList } = require("./customer.controller");
const logger = require('../../model/LoggerModel');


const getReportPermission = (cust_id,admin_name) => {
  // console.log(cust_id,'cttt');

  return new Promise(async (resolve, reject) => {
    if (!cust_id || !admin_name) {
      return resolve({ suc: 0, msg: [], error: "Customer ID or Admin Name missing" });
    }

      let select = "*",
      table_name = "md_admin_report_permit",
      whr = `customer_id=${cust_id} AND user_id = '${admin_name}'`,
      order = null;

      try{
      var report = await db_Select(select,table_name,whr,order);
      // console.log(report);
      resolve(report)
      }catch(error){
         reject(error);
      }
  })
};

const getAllReportList = (id = 0,cust_id) => {
    return new Promise(async (resolve, reject) => {
      var edit_report_data= await db_Select("a.*,b.user_name","md_admin_report_permit a LEFT JOIN md_super_admin b ON a.customer_id = b.customer_id AND a.user_id = b.user_id",id > 0 ? `a.customer_id = ${cust_id} AND a.sl_no = ${id} AND b.user_type = 'A'` : null,
        null
      );
      // console.log(edit_report_data,'22');
      resolve(edit_report_data);
    });
  };


const report_permit = async(req,res)=>{
 try{
    var method = req.method;
    var user = req.session.user;

    var selected = {
      cust_id: method == 'POST' ? req.body.cust_name : '',
      admin_name: method == "POST" ? req.body.admin : '',
    };
    // console.log(selected.cust_id,selected.admin_name,'cust');
    

    var cust = await getAllCustomerList();
    var report = await getReportPermission(selected.cust_id, selected.admin_name);

    const page_data = {
        title: "Report Permission",
        page_path: "super_admin/report_permission/add_report_permission",
        customer: cust.suc > 0 ? cust.msg : null,
        data: report.suc > 0 ? report.msg : null,
        selected
      };
      // console.log(page_data,'lolo');
      res.render("common/layouts/main",page_data);
 } catch(error) {
   console.log(error);
  // logger.error(err); // Log the error
   res.redirect("/superadmin_login");
 }
};

const get_admin = async (req, res) => {
  var data = req.body;
  // console.log(data, "1000");
  var select = "*",
    table_name = "md_super_admin",
    where = `customer_id = '${data.cust_name}' AND user_type = 'A'`;
  var admin_id = await db_Select(select, table_name, where, null);
  // console.log(dev_id, "lalala");
  res.json({
    SUCCESS: { admin_id },
    status: true,
  });
};

  const report_permit_edit = async(req,res) =>{
    try {
      var data = req.query
    //   console.log(data);
        var report_dt = await getAllReportList(data.id,data.customer_id)
        var cust = await getAllCustomerList()
        const page_data = {
          id: data.id,
          customer_id: data.customer_id,
          title: "Report Permission Edit details",
          page_path: "/super_admin/report_permission/edit_report_permission",
          data: report_dt.suc > 0 ? report_dt.msg : null,
          customer: cust.suc > 0 ? cust.msg : null,
        };
        // console.log(page_data,'p');
        res.render("common/layouts/main",page_data);
      } catch (error) {
        // console.log(error);
        logger.error(err); // Log the error
        res.redirect("/superadmin_login");
      }
  };  


  const save_edit_report_permitt = async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.optional(),
        cust_id: Joi.required(),
        admin_ids: Joi.optional(),
        detail_flag: Joi.optional(),
        vehicle_flag: Joi.optional(),
        device_flag: Joi.optional(),
        operator_flag: Joi.optional(),
        shift_flag: Joi.optional(),
        summary_flag:Joi.optional()
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      // console.log(value,'poiu');
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
          const existing = await db_Select(
            "*",
            "md_admin_report_permit",
            `customer_id='${value.cust_id}' AND sl_no='${value.id}'`
          );
          oldData = existing.msg[0] || null;
        }
  
      let fields = value.id > 0 ? `detail_report='${value.detail_flag == "Y" ? "Y" : "N"}',veh_wise_report='${value.vehicle_flag == "Y" ? "Y" : "N"}',dev_wise_report='${value.device_flag == "Y" ? "Y" : "N"}',operate_wise_report='${value.operator_flag == "Y" ? "Y" : "N"}',shift_wise_report='${value.shift_flag == "Y" ? "Y" : "N"}',summary_report='${value.summary_flag == "Y" ? "Y" : "N"}',updated_by='${user_name}',updated_at='${datetime}'` : "(customer_id,user_id,detail_report,veh_wise_report,dev_wise_report,operate_wise_report,shift_wise_report,summary_report,created_by,created_at)",
        values = `('${value.cust_id}','${value.admin_ids}','${value.detail_flag == "Y" ? "Y" : "N"}','${value.vehicle_flag == "Y" ? "Y" : "N"}','${value.device_flag == "Y" ? "Y" : "N"}','${value.operator_flag == "Y" ? "Y" : "N"}','${value.shift_flag == "Y" ? "Y" : "N"}','${value.summary_flag == "Y" ? "Y" : "N"}','${user_name}','${datetime}')`;
      let res_dt = await db_Insert("md_admin_report_permit", fields, values, value.id > 0 ? `sl_no=${value.id} AND customer_id = ${value.cust_id}` : null, value.id > 0 ? 1 : 0);
      // console.log(res_dt,'resssst');
      
      // req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
      // ==== Logging ====
      if (oldData) {
      const changes = [];
       if (oldData.detail_report !== (value.detail_flag == "Y" ? "Y" : "N"))
        changes.push(`detail_report: '${oldData.detail_report}' → '${value.detail_flag == "Y" ? "Y" : "N"}'`);

       if (oldData.veh_wise_report !== (value.vehicle_flag == "Y" ? "Y" : "N"))
        changes.push(`veh_wise_report: '${oldData.veh_wise_report}' → '${value.vehicle_flag == "Y" ? "Y" : "N"}'`);

       if (oldData.dev_wise_report !== (value.device_flag == "Y" ? "Y" : "N"))
        changes.push(`dev_wise_report: '${oldData.dev_wise_report}' → '${value.device_flag == "Y" ? "Y" : "N"}'`);

       if (oldData.operate_wise_report !== (value.operator_flag == "Y" ? "Y" : "N"))
        changes.push(`operate_wise_report: '${oldData.operate_wise_report}' → '${value.operator_flag == "Y" ? "Y" : "N"}'`);

      if (oldData.shift_wise_report !== (value.shift_flag == "Y" ? "Y" : "N"))
        changes.push(`shift_wise_report: '${oldData.shift_wise_report}' → '${value.shift_flag == "Y" ? "Y" : "N"}'`); 

      if (oldData.summary_report !== (value.summary_flag == "Y" ? "Y" : "N"))
        changes.push(`summary_report: '${oldData.summary_report}' → '${value.summary_flag == "Y" ? "Y" : "N"}'`);
      logger.info(
        `${user_name} Updated Operator [CustID: ${value.cust_id}, ID: ${value.id}] Fields changed: ${changes.join(", ")}`
      );
      req.flash("success", "Updated successfully");
        } else {
      const createdFields = [
        `customer_id: '${value.cust_id}'`,
        `detail_report: '${value.detail_flag == "Y" ? "Y" : "N"}'`,
        `veh_wise_report: '${value.vehicle_flag == "Y" ? "Y" : "N"}'`,
        `dev_wise_report: '${value.device_flag == "Y" ? "Y" : "N"}'`,
        `operate_wise_report: '${value.operator_flag == "Y" ? "Y" : "N"}'`,
        `shift_wise_report: '${value.shift_flag == "Y" ? "Y" : "N"}'`,
        `summary_report: '${value.summary_flag == "Y" ? "Y" : "N"}'`,
      ];
      logger.info(
        `${user_name} Created Operator [CustID: ${value.cust_id}] Fields: ${createdFields.join(", ")}`
      );
      req.flash("success", "Saved successfully");
    }
      res.redirect("/superadmin/report_permission");
    } catch (error) {
      console.log(error);
      // logger.error(err); // Log the error
      const isUpdate = req.body && req.body.id > 0;
      req.flash("error", isUpdate ? "Data not updated Successfully" : "Data not saved Successfully");
      res.redirect("/superadmin/report_permission");
    }
  }; 

module.exports = {report_permit, report_permit_edit,save_edit_report_permitt, get_admin}