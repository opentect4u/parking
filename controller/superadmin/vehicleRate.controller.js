const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select } = require("../../model/Master.model");
const { getAllCustomerList } = require("./customer.controller");
const { getAllSellerList } = require("./seller.controller");
const { getAllVehicleList } = require("./vehicle.controller");

const getAllVehicleRateList = (id = 0) => {
    return new Promise(async (resolve, reject) => {
        var vehicle_rate = await db_Select('seller_id,customer_id,rate_type,vehicle_id,from_hour,to_hour,vehicle_rate,rate_flag,night_day_flag','md_rate_dtls', id > 0 ? `vehicle_id = ${id}` : null, null);
        resolve(vehicle_rate)
    })
};

const vehicle_rate = async(req,res) =>{
    try {
        var method = req.method
        var selected = {
          cust_id: method == 'POST' ? req.body.cust_name : ''
        }
        var cust = await getAllCustomerList()
        var seller_name = await getAllSellerList()
        var vehicle = await getAllVehicleList()
          veh_rate_list = [];
        if(method == 'POST'){
          veh_rate_list = await show_vehicle_rate_dtls(selected.cust_id)
          veh_rate_list = veh_rate_list.suc > 0 ? veh_rate_list.msg : []
        }

        const page_data = {
          title: "Vehicle Rate details",
          page_path: "super_admin/vehicle_rate/vehicle_rate",
          data: veh_rate_list,
          customer: cust.suc > 0 ? cust.msg : null,
          seller: seller_name.suc > 0 ? seller_name.msg : null,
          vehicle: vehicle.suc > 0 ? vehicle.msg : null,
          selected
        };
        console.log(cust,'999');
        res.render("common/layouts/main",page_data);
        console.log(page_data,'...');
      } catch (error) {
        console.log(error);
        res.redirect("/superadmin_login");
      }
};

const show_vehicle_rate_dtls = (cust_id) => {
    return new Promise(async (resolve, reject) => {
      let select = "a.*,b.*",
        table_name = "md_rate_dtls a, md_seller b",
        whr = `a.seller_id = b.seller_id AND a.customer_id=${cust_id}`;
      const vehicle_dt = await db_Select(select, table_name, whr, null);
      resolve(vehicle_dt)
    })
  };

  const get_vehicle = async (req, res) => {
    var data = req.body;
    console.log(data, "1000");
    var select = "*",
      table_name = "md_vehicle",
      where = `customer_id = '${data.cust_id}'`;
    var veh_id = await db_Select(select, table_name, where, null);
    console.log(veh_id, "lalala");
    res.json({
      SUCCESS: { veh_id },
      status: true,
    });
  };
  

module.exports = {vehicle_rate,show_vehicle_rate_dtls,get_vehicle}
