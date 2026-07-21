const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");
const { getAllCustomerList } = require("./customer.controller");
const logger = require('../../model/LoggerModel');

const getAllDeviceList = (id = 0, cust_id) => {
  return new Promise(async (resolve, reject) => {
    var device_dt = await db_Select(
      "*",
      "md_setting",
      id > 0 ? `customer_id = ${cust_id} AND setting_id = ${id}` : null,
      null
    );
    resolve(device_dt);
  });
};

const device = async (req, res) => {
  try {
    var method = req.method;
    var selected = {
      cust_id: method == "POST" ? req.body.cust_name : "",
      dev_name: method == "POST" ? req.body.dev_id : "",
      dev_mode: method == "POST" ? req.body.dev_mod : "",
    };
    var cust = await getAllCustomerList();
    device_list = [];
    if (method == "POST") {
      device_list = await show_device_dtls(selected.cust_id, selected.dev_name);
      device_list = device_list.suc > 0 ? device_list.msg : [];
    }
    const page_data = {
      title: "Device Setting details",
      page_path: "super_admin/device_setting/device_setting",
      data: device_list,
      customer: cust.suc > 0 ? cust.msg : null,
      selected,
    };
    // console.log(data, "lolo");
    res.render("common/layouts/main", page_data);
  } catch (error) {
    // console.log(error);
    logger.error(err); // Log the error
    res.redirect("/superadmin_login");
  }
};

const get_device_id = async (req, res) => {
  var data = req.body;
  // console.log(data, "1000");
  var select = "setting_id,app_id",
    table_name = "md_setting",
    where = `customer_id = '${data.cust_name}'`;
  var dev_id = await db_Select(select, table_name, where, null);
  // console.log(dev_id, "lalala");
  res.json({
    SUCCESS: { dev_id },
    status: true,
  });
};

const get_dev_mode = async (req, res) => {
  var data = req.body;
  // console.log(data, "1000");
  var select = "dev_mod",
    table_name = "md_customer",
    where = `customer_id = '${data.cust_id}'`;
  var dev_mod = await db_Select(select, table_name, where, null);
  // console.log(dev_mod, "lalala");
  res.json({
    SUCCESS: { dev_mod },
    status: true,
  });
};

const show_device_dtls = (cust_id, dev_name) => {
  return new Promise(async (resolve, reject) => {
    let select = "a.*,b.customer_id,b.customer_name",
      table_name = "md_setting a, md_customer b",
      whr = `a.customer_id = b.customer_id AND a.customer_id = ${cust_id} AND a.app_id = '${dev_name}'`;
    const device_dt = await db_Select(select, table_name, whr, null);
    // console.log(device_dt,'111');
    resolve(device_dt);
  });
};

const edit_device = async (req, res) => {
  try {
    var data = req.query;
    // console.log(data, ";;;");
    var dev_dt = await getAllDeviceList(data.id, data.customer_id);
    // console.log(dev_dt, "REPORT DETAILS");
    var cust = await getAllCustomerList();
    const page_data = {
      id: data.id,
      customer_id: data.customer_id,
      title: "Device Setting Edit details",
      page_path: "/super_admin/device_setting/edit_device_setting",
      data: dev_dt.suc > 0 ? dev_dt.msg : null,
      customer: cust.suc > 0 ? cust.msg : null,
    };
    // console.log(page_data, "ll");
    res.render("common/layouts/main", page_data);
  } catch (error) {
    // console.log(error);
    logger.error(err); // Log the error
    res.redirect("/superadmin_login");
  }
};

const save_device = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.required(),
      cust_id: Joi.optional(),
      app_id: Joi.optional(),
      dev_mode: Joi.optional(),
      gst_flag: Joi.optional(),
      dev_type: Joi.optional(),
      report_flag: Joi.optional(),
      tot_col: Joi.optional(),
      redirect_flag: Joi.optional(),
      grace_flag: Joi.optional(),
      grace_value: Joi.optional(),
      adv_pay_flag: Joi.optional(),
      adv_value: Joi.optional(),
      dev_type: Joi.optional(),
      pay_mode_flag: Joi.optional(),
      qr_code_flag: Joi.optional(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    // console.log(value, "+++");
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
        "md_setting",
        `customer_id='${value.cust_id}' AND setting_id='${value.id}'`
      );
      oldData = existing.msg[0] || null;
    }

    let fields =
      value.id > 0
        ? `report_flag='${value.report_flag == "Y" ? "Y" : "N"
        }',total_collection='${value.tot_col == "Y" ? "Y" : "N"
        }',adv_pay='${value.adv_pay_flag && value.adv_pay_flag == "Y" ? "Y" : "N"
        }',adv_value='${value.adv_value}',grace_period_flag='${value.grace_flag == "Y" ? "Y" : "N"
        }',grace_value='${value.grace_value && value.grace_value.includes(":")
          ? value.grace_value                      // already HH:MM:SS
          : value.grace_value != ""
            ? `00:${value.grace_value.padStart(2, "0")}:00` // treat as minutes
            : "00:00:00"
        }',
redirection_flag='${value.redirect_flag == "Y" ? "Y" : "N"
        }',gst_flag='Y',pay_mode_flag='${value.pay_mode_flag == "Y" ? "Y" : "N"}',qr_code_flag='${value.qr_code_flag == "Y" ? "Y" : "N"}',modified_by='${user_name}',updated_at='${datetime}'`
        : "(app_id,customer_id,device_type,dev_mod,report_flag,total_collection,adv_pay,adv_value,grace_period_flag,grace_value,redirection_flag,gst_flag,pay_mode_flag,qr_code_flag,created_by,created_at)",
      values = `('${value.app_id}','${value.cust_id}','${value.dev_type}','${value.dev_mode
        }','${value.report_flag == "Y" ? "Y" : "N"}','${value.tot_col == "Y" ? "Y" : "N"
        }','${value.adv_pay_flag && value.adv_pay_flag == "Y" ? "Y" : "N"}','${value.adv_value
        }','${value.grace_flag == "Y" ? "Y" : "N"}','${value.grace_value != "" ? `00:${value.grace_value}:00` : 0
        }','${value.redirect_flag == "Y" ? "Y" : "N"
        }','Y','${value.pay_mode_flag && value.pay_mode_flag == "Y" ? "Y" : "N"
        }','${value.qr_code_flag && value.qr_code_flag == "Y" ? "Y" : "N"
        }','${user_name}','${datetime}')`;
    let res_dt = await db_Insert(
      "md_setting",
      fields,
      values,
      // value.id > 0
      //   ? `setting_id=${value.id} AND customer_id = ${value.cust_id}`
      //   : null,
      value.id > 0
        ? `customer_id = ${value.cust_id}`
        : null,
      value.id > 0 ? 1 : 0
    );
    // console.log("========vehicle==========", res_dt);

    if (oldData) {
      const changes = [];
      if (oldData.report_flag !== (value.report_flag == "Y" ? "Y" : "N"))
        changes.push(`report_flag: '${oldData.report_flag}' → '${value.report_flag == "Y" ? "Y" : "N"}'`);

      if (oldData.total_collection !== (value.tot_col == "Y" ? "Y" : "N"))
        changes.push(`total_collection: '${oldData.total_collection}' → '${value.tot_col == "Y" ? "Y" : "N"}'`);

      if (oldData.redirection_flag !== (value.redirect_flag == "Y" ? "Y" : "N"))
        changes.push(`redirection_flag: '${oldData.redirection_flag}' → '${value.redirect_flag == "Y" ? "Y" : "N"}'`);

      if (oldData.grace_period_flag !== (value.grace_flag == "Y" ? "Y" : "N"))
        changes.push(`grace_period_flag: '${oldData.grace_period_flag}' → '${value.grace_flag == "Y" ? "Y" : "N"}'`);

      if (oldData.grace_value !== value.grace_value)
        changes.push(`grace_value: '${oldData.grace_value}' → '${value.grace_value}'`);

      if (oldData.adv_pay !== (value.adv_pay_flag == "Y" ? "Y" : "N"))
        changes.push(`adv_pay: '${oldData.adv_pay}' → '${value.adv_pay_flag == "Y" ? "Y" : "N"}'`);

      if (oldData.adv_value !== value.adv_value)
        changes.push(`adv_value: '${oldData.adv_value}' → '${value.adv_value}'`);

      if (oldData.pay_mode_flag !== (value.pay_mode_flag == "Y" ? "Y" : "N"))
        changes.push(`pay_mode_flag: '${oldData.pay_mode_flag}' → '${value.pay_mode_flag == "Y" ? "Y" : "N"}'`);

      if (oldData.qr_code_flag !== (value.qr_code_flag == "Y" ? "Y" : "N"))
        changes.push(`qr_code_flag: '${oldData.qr_code_flag}' → '${value.qr_code_flag == "Y" ? "Y" : "N"}'`);

      logger.info(
        `${user_name} Updated Operator [CustID: ${value.cust_id}, ID: ${value.id}] Fields changed: ${changes.join(", ")}`
      );
      req.flash(
        "success", "Updated successfully");
    } else {
      const createdFields = [
        `customer_id: '${value.cust_id}'`,
        `dev_mode: '${value.dev_mode}'`,
        `app_id: '${value.app_id}'`,
        `gst_flag: '${value.gst_flag == "Y" ? "Y" : "N"}'`,
        `device_type: '${value.dev_type}'`,
        `report_flag: '${value.report_flag == "Y" ? "Y" : "N"}'`,
        `total_collection: '${value.tot_col == "Y" ? "Y" : "N"}'`,
        `redirection_flag: '${value.redirect_flag == "Y" ? "Y" : "N"}'`,
        `grace_period_flag: '${value.grace_flag == "Y" ? "Y" : "N"}'`,
        `grace_value: '${value.grace_value}'`,
        `adv_pay: '${value.adv_pay_flag == "Y" ? "Y" : "N"}'`,
        `adv_value: '${value.adv_value}'`,
        `pay_mode_flag: '${value.pay_mode_flag == "Y" ? "Y" : "N"}'`,
        `qr_code_flag: '${value.qr_code_flag == "Y" ? "Y" : "N"}'`,
      ];
      logger.info(
        `${user_name} Created Operator [CustID: ${value.cust_id}] Fields: ${createdFields.join(", ")}`
      );
      req.flash("success", "Saved successfully");
    }
    res.redirect("/superadmin/device_setting");
    //   res.send(res_dt)
  } catch (error) {
    // console.log(error,'ERRR');
    const isUpdate = req.body && req.body.id > 0;
    req.flash(
      "error",
      isUpdate
        ? "Data not updated Successfully"
        : "Data not saved Successfully"
    );
    res.redirect("/superadmin/device_setting");
  }
};

module.exports = {
  device,
  get_device_id,
  show_device_dtls,
  edit_device,
  get_dev_mode,
  save_device,
  getAllDeviceList,
};
