const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");
const { getAllSellerList } = require("./seller.controller");
const { getAllLocationList } = require("./location.controller");

const getAllCustomerList = (id = 0, sailer_id = 0) => {
    return new Promise(async (resolve, reject) => {
        var select = "a.*,b.seller_name,b.seller_addr,b.seller_mob,b.location_id,c.*",
        table_name = "md_customer a, md_seller b, md_locations c",
        where = `a.seller_id = b.seller_id
        AND a.location_id = c.location_id ${id > 0 ? `AND a.customer_id=${id}` : ''} ${sailer_id > 0 ? `AND a.seller_id=${sailer_id}` : ''}`,
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
        // console.log(error);
        res.redirect("/superadmin_login");
      }
};

const customer_edit = async(req,res) =>{
  try {
    var data = req.query
    // console.log(data,'lolo');
      var cust = await getAllCustomerList(data.id)
      var seller = await getAllSellerList()
      var loc = await getAllLocationList()
      const page_data = {
        id: data.id,
        title: "Customer Edit details",
        page_path: "/super_admin/customer/edit_customer",
        data: cust.suc > 0 ? cust.msg : null,
        sell: seller.suc > 0 ? seller.msg : null,
        location: loc.suc > 0 ? loc.msg : null,
      };
      console.log(page_data,'lalal');
      res.render("common/layouts/main",page_data);
    } catch (error) {
      // console.log(error);
      res.redirect("/superadmin_login");
    }
};

const save_add_customer = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.required(),
      sell_name: Joi.required(),
      cust_name: Joi.required(),
      loc_name: Joi.required(),
      phone: Joi.required(),
      email: Joi.required(),
      dev_mode: Joi.required(),
      no_device: Joi.required(),
      cust_type: Joi.required(),
      dev_type: Joi.required(),
      cust_add: Joi.required(),
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

    let fields = value.id > 0 ? `seller_id='${value.sell_name}',customer_name='${value.cust_name}',location_id='${value.loc_name}',mobile_no='${value.phone}',email='${value.email}',cust_addr='${value.cust_add}',dev_mod='${value.dev_mode}',no_device='${value.no_device}',customer_type='${value.cust_type}',device_type='${value.dev_type}',updated_by='${user_name}',updated_at='${datetime}'` : "(seller_id,customer_name,location_id,mobile_no,email,cust_addr,dev_mod,no_device,customer_type,device_type,created_by,created_at)",
      values = `('${value.sell_name}','${value.cust_name}','${value.loc_name}','${value.phone}','${value.email}','${value.cust_add}','${value.dev_mode}','${value.no_device}','${value.cust_type}','${value.dev_type}','${user_name}','${datetime}')`;
    let res_dt = await db_Insert("md_customer", fields, values, value.id > 0 ? `customer_id=${value.id}` : null, value.id > 0 ? 1 : 0);
    console.log("========customer==========", res_dt);
    req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
    res.redirect("/superadmin/customer");
  //   res.send(res_dt)
  } catch (error) {
    console.log(error);
    req.flash("error", value.id > 0 ? "Data not updated Successfully" : "Data not saved Successfully");
    res.redirect("/superadmin/customer");
  }
};

module.exports = {customer,customer_edit,save_add_customer,getAllCustomerList}