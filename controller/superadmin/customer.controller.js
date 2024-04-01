const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select } = require("../../model/Master.model");
const { getAllSellerList } = require("./seller.controller");
const { getAllLocationList } = require("./location.controller");

const getAllCustomerList = (id = 0) => {
    return new Promise(async (resolve, reject) => {
        var select = "a.*,b.seller_name,b.seller_addr,b.seller_mob,b.location_id,c.*",
        table_name = "md_customer a, md_seller b, md_locations c",
        where = `a.seller_id = b.seller_id
        AND a.location_id = c.location_id ${id > 0 ? `AND a.customer_id=${id}` : ''}`,
        order = `Order By a.seller_id ASC`;
        var cust = await db_Select(select,table_name,where,order);
        resolve(cust)
    })   
}

const customer = async(req,res) =>{
    try {
        var cust = await getAllCustomerList()
        var seller = await getAllSellerList()
        var loc = await getAllLocationList()
        const page_data = {
          title: "Customer details",
          page_path: "/super_admin/customer/customer",
          data: cust.suc > 0 ? cust.msg : null,
          location: loc.suc > 0 ? loc.msg : null,
          sell: seller.suc > 0 ? seller.msg : null,
        };
        // console.log(page_data);
        res.render("common/layouts/main",page_data);
      } catch (error) {
        console.log(error);
        res.redirect("/superadmin_login");
      }
};

const customer_edit = async(req,res) =>{
  try {
    var data = req.query
    console.log(data);
      var cust = await getAllCustomerList(data.id)
      var seller_dt = await getAllSellerList(data.id)
      var loc = await getAllLocationList()
      const page_data = {
        id: data.id,
        title: "Customer Edit details",
        page_path: "/super_admin/customer/edit_customer",
        data: cust.suc > 0 ? cust.msg : null,
        seller: seller_dt.suc > 0 ? seller_dt.msg : null,
        location: loc.suc > 0 ? loc.msg : null,
      };
      console.log(page_data);
      res.render("common/layouts/main",page_data);
    } catch (error) {
      console.log(error);
      res.redirect("/superadmin_login");
    }
};

module.exports = {customer,customer_edit}