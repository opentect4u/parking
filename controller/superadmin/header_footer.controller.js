const Joi = require("joi");
const dateFormat = require("dateformat");
const { getAllCustomerList } = require("./customer.controller");
const { db_Select } = require("../../model/Master.model");

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
        var method = req.method
        var selected = {
            cust_id: method == 'POST' ? req.body.cust_name : ''
    }
    var cust = await getAllCustomerList()
    head_foot_list = [];
    if (method == "POST") {
      head_foot_list = await show_vehicle_rate_dtls(
        selected.cust_id,
        selected.veh_name
      );
      head_foot_list = head_foot_list.suc > 0 ? head_foot_list.msg : [];
    }
      const page_data = {
        title: "Header Footer details",
        page_path: "super_admin/header_footer/header_footer",
        customer: cust.suc > 0 ? cust.msg : null,
        selected
      };
      console.log(page_data, "999");
      res.render("common/layouts/main", page_data);
    } catch (error) {
      console.log(error);
      res.redirect("/superadmin_login");
    }
  };

  const show_header_footer_dtls = (cust_id) => {
    return new Promise(async (resolve, reject) => {
      let select = "*",
        table_name = "md_rate_dtls a, md_seller b",
        whr = `a.seller_id = b.seller_id AND a.customer_id=${cust_id} AND a.vehicle_id = ${veh_name}`;
      const vehicle_dt = await db_Select(select, table_name, whr, null);
      resolve(vehicle_dt);
    });
  };

  module.exports = {header_footer}