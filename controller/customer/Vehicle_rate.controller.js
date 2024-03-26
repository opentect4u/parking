const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");

const vehicle_rate = async (req, res) => {
  try {
    var custId = req.session.user.user_data.customer_id,
    dev_mode = req.session.user.user_data.dev_mode;
    var select = "vehicle_id, vehicle_name",
      table_name = "md_vehicle",
      where = `customer_id=${custId}`;
    var vehicle = await db_Select(select, table_name, where, null);
    console.log(vehicle);
    const page_data = {
      title: "Vehicle rate details",
      page_path: "/vehicle_rate/add_vehicle_rate",
      data: vehicle.suc > 0 ? vehicle.msg : [],
    };
    console.log(data,req.session.user.user_data,'lalaal');
    res.render("common/layouts/main", page_data);
  } catch (error) {
    res.redirect("/login");
  }
};

const get_vehicle_id = async (req, res) => {
  var data = req.body;
  // console.log(data, "999");
  var custId = req.session.user.user_data.customer_id;
  var select = "vehicle_id",
    table_name = "md_rate_dtls",
    where = `customer_id = '${custId}' AND rate_type='${data.rate_type}'`;
  var vech_id = await db_Select(select, table_name, where, null);
  // console.log(vech_id, "lalala");
  res.json({
    SUCCESS: { vech_id },
    status: true,
  });
};

const show_veichle = async (req, res) => {
  var data = req.query;
  console.log(data);
  try {
    var custId = req.session.user.user_data.customer_id;
    dev_mode = req.session.user.user_data.dev_mode;
    // console.log(req.session.user.user_data);
    let select = "a.*",
      table_name = "md_rate_dtls a",
      whr = `a.customer_id=${custId} AND a.vehicle_id='${data.veh_id}'`;
    const vehicle_dt = await db_Select(select, table_name, whr, null);
    res.json(vehicle_dt);
  } catch (error) {
    console.log(error);
    res.json({
      suc: 0,
      msg: [],
    });
  }
};

const save_add_vehicle_rate = async (req, res) => {
  try {
    const schema = Joi.object({
      cust_id: Joi.optional(),
      rate_type: Joi.required(),
      vehicle_id: Joi.required(),
      frm_hr: Joi.required(),
      to_hr: Joi.required(),
      park_fee: Joi.required(),
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

    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var custId = req.session.user.user_data.customer_id;
    var sellerId = req.session.user.user_data.seller_id;
    // console.log(value);
    let fields =
        "(seller_id,customer_id,rate_type,vehicle_id,from_hour,to_hour,vehicle_rate,rate_flag,night_day_flag,created_at)",
      values = `('${sellerId}','${custId}','${value.rate_type}','${value.vehicle_id}','${value.frm_hr}','${value.to_hr}','${value.park_fee}','F','O','${datetime}')`;
    let res_dt = await db_Insert("md_rate_dtls", fields, values, null, 0);
    // console.log("========vehicle_rate==========", res_dt);
    req.flash("success", "Saved successful");
    res.redirect("/rate/vehicle_rate_dtls");
    // res.send(res_dt)
  } catch (error) {
    console.log(error);
    req.flash("error", "Data not saved Successfully");
    res.redirect("/rate/vehicle_rate_dtls");
  }
};

const edit_vehicle_rate = async (req, res) => {
  var data = req.query;
  console.log(data,'lala');
  var custId = req.session.user.user_data.customer_id;
  let select = "a.*,b.customer_id,b.customer_name",
    table_name = "md_rate_dtls a, md_customer b",
    whr = `a.customer_id = b.customer_id AND a.customer_id=${custId} AND sl_no='${data.sl_no}'`;
  const resData = await db_Select(select, table_name, whr, null);
  console.log(resData);
  delete resData.sql;
  var viewData = {
    title: "Vehicle Rate",
    page_path: "/vehicle_rate/edit_vehicle_rate",
    data: resData.suc > 0 && resData.msg.length > 0 ? resData.msg[0] : [],
    customer_id: custId,
  };
  // console.log(data,"value");
  console.log(viewData,'12345');
  res.render("common/layouts/main", viewData);
};

const save_edit_vehicle_rate = async (req, res) => {
  try {
    const schema = Joi.object({
      cust_id: Joi.optional(),
      sl_no: Joi.optional(),
      rate_type: Joi.optional(),
      vehicle_id: Joi.required(),
      frm_hr: Joi.required(),
      to_hr: Joi.required(),
      park_fee: Joi.required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    console.log(value);
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.context.key] = detail.message;
      });
      return res.json({ error: errors });
    }

    var custId = req.session.user.user_data.customer_id;
    var sellerId = req.session.user.user_data.seller_id;

    const datetime = dateFormat(new Date(), "yyyy-mm-dd");

    let fields = `seller_id='${sellerId}',customer_id='${custId}',rate_type='${value.rate_type}',vehicle_id='${value.vehicle_id}',from_hour='${value.frm_hr}',to_hour='${value.to_hr}',vehicle_rate='${value.park_fee}',rate_flag='F',night_day_flag='O',updated_at='${datetime}'`,
      where = `customer_id='${custId}' AND sl_no='${value.sl_no}'`;
    let res_dt2 = await db_Insert("md_rate_dtls", fields, null, where, 1);
    console.log(res_dt2);
    req.flash("success", "Updated successful");
    res.redirect("/rate/vehicle_rate_dtls");
  } catch (error) {
    console.log(error);
    req.flash("error", "Data not Updated Successfully");
    res.redirect("/rate/vehicle_rate_dtls");
  }
};

module.exports = { vehicle_rate, get_vehicle_id, show_veichle,save_add_vehicle_rate,edit_vehicle_rate,save_edit_vehicle_rate };
