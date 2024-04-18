const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select } = require("../../model/Master.model");
const { getAllCustomerList } = require("./customer.controller");

const device = async(req,res)=>{
    try{
       var method = req.method
       var selected = {
         cust_id: method == 'POST' ? req.body.cust_name : '',
         dev_name: method == 'POST' ? req.body.dev_id : ''
       }
       var cust = await getAllCustomerList()
         device_list = [];
       if(method == 'POST'){
         device_list = await show_device_dtls(selected.cust_id,selected.dev_name)
         device_list = device_list.suc > 0 ? device_list.msg : []
       }
       const page_data = {
           title: "Device Setting details",
           page_path: "super_admin/device_setting/device_setting",
           data: device_list,
           customer: cust.suc > 0 ? cust.msg : null,
           selected
         };
         console.log(page_data,'lolo');
         res.render("common/layouts/main",page_data);
    } catch(error) {
      console.log(error);
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
    console.log(data, "1000");
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

  const show_device_dtls = (cust_id,dev_name) => {
    return new Promise(async (resolve, reject) => {
      let select = "a.*,b.customer_id,b.customer_name",
        table_name = "md_setting a, md_customer b",
        whr = `a.customer_id = b.customer_id AND a.customer_id = ${cust_id} AND a.app_id = '${dev_name}'`;
      const device_dt = await db_Select(select, table_name, whr, null);
      // console.log(device_dt,'111');
      resolve(device_dt)
    })
  };

  const edit_device = async (req, res) => {
    try {
        var data = req.query
        console.log(data,';;;');
          // var report_dt = await getAllreportList(0,data.customer_id)
          // console.log(report_dt, 'REPORT DETAILS');
          var cust = await getAllCustomerList()
          const page_data = {
            id: data.id,
            customer_id: data.customer_id,
            title: "Device Setting Edit details",
            page_path: "/super_admin/device_setting/edit_device_setting",
            // data: report_dt.suc > 0 ? report_dt.msg : null,
            customer: cust.suc > 0 ? cust.msg : null,
          };
          // console.log(page_data,'ll');
          res.render("common/layouts/main",page_data);
        } catch (error) {
          // console.log(error);
          res.redirect("/superadmin_login");
        }
  };

   module.exports = {device,get_device_id,show_device_dtls,edit_device}