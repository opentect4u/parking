const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select } = require("../../model/Master.model");

const vehicle_rate = async(req,res) =>{
    try {
        var custId = req.session.user.user_data.customer_id;
        var select = "a.*,b.customer_id,b.customer_name",
          table_name = "md_rate_dtls a, md_customer b",
          where = `a.customer_id = b.customer_id AND a.customer_id=${custId}`;
        var vehicle = await db_Select(select, table_name, where, null);
        console.log(vehicle);
        const page_data = {
          title: "Vehicle rate details",
          page_path: "/vehicle_rate/add_vehicle_rate",
          data: vehicle,
        };
        res.render("common/layouts/main", page_data);
      } catch (error) {
        res.redirect("/login");
      }
};


module.exports = {vehicle_rate}