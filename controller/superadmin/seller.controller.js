const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");
const { getAllLocationList } = require("./location.controller");
const logger = require('../../model/LoggerModel');

const getAllSellerList = (id = 0) => {
    return new Promise(async (resolve, reject) => {
        var select = "a.seller_id, a.seller_name, a.seller_addr, a.seller_mob, a.email, a.location_id, b.loction",
        table_name = "md_seller a, md_locations b",
        where = `a.location_id = b.location_id ${id > 0 ? `AND a.seller_id=${id}` : ''}`,
        order = null;
        var seller = await db_Select(select,table_name,where,order);
        resolve(seller)
    })   
}

const seller = async(req,res) =>{
    try {
        var seller = await getAllSellerList()
        var loc = await getAllLocationList()
        const page_data = {
          title: "Seller details",
          page_path: "/super_admin/seller/seller",
          data: seller.suc > 0 ? seller.msg : null,
          location: loc.suc > 0 ? loc.msg : null,
        };
        // console.log(data);
        res.render("common/layouts/main",page_data);
      } catch (error) {
        // console.log(error);
        logger.error(err); // Log the error
        res.redirect("/superadmin_login");
      }
};

const seller_edit = async(req,res) =>{
  try {
    var data = req.query
      var seller_dt = await getAllSellerList(data.id)
      var loc = await getAllLocationList()
      const page_data = {
        id: data.id,
        title: "Seller Edit details",
        page_path: "/super_admin/seller/edit_seller",
        data: seller_dt.suc > 0 ? seller_dt.msg : null,
        location: loc.suc > 0 ? loc.msg : null,
      };
      // console.log(page_data);
      res.render("common/layouts/main",page_data);
    } catch (error) {
      // console.log(error);
      logger.error(err); // Log the error
      res.redirect("/superadmin_login");
    }
};

const save_add_seller = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.required(),
      sell_name: Joi.required(),
      phone: Joi.required(),
      email: Joi.required(),
      loc_name: Joi.required(),
      sell_add: Joi.required(),
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

    let fields = value.id > 0 ? `seller_name='${value.sell_name}',seller_addr='${value.sell_add}',seller_mob='${value.phone}',email='${value.email}',location_id='${value.loc_name}',modified_by='${user_name}',updated_at='${datetime}'` : "(seller_name,seller_addr,seller_mob,email,location_id,created_by,created_at)",
      values = `('${value.sell_name}','${value.sell_add}','${value.phone}','${value.email}','${value.loc_name}','${user_name}','${datetime}')`;
    let res_dt = await db_Insert("md_seller", fields, values, value.id > 0 ? `seller_id=${value.id}` : null, value.id > 0 ? 1 : 0);
    // console.log("========location==========", res_dt);
    req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
    res.redirect("/superadmin/seller");
  //   res.send(res_dt)
  } catch (error) {
    // console.log(error);
    logger.error(err); // Log the error
    req.flash("error", value.id > 0 ? "Data not updated Successfully" : "Data not saved Successfully");
    res.redirect("/superadmin/seller");
  }
};

module.exports = {seller,save_add_seller,seller_edit,getAllSellerList}