const { db_Select, db_Insert } = require("../../model/Master.model");
const dateFormat = require("dateformat");
const Joi = require('joi')

const cust_name = async (req, res) =>{
    try {
        var custId = req.session.user.user_data.customer_id;
        var select = "DISTINCT  a.customer_id,b.customer_name,a.adv_pay",
          table_name = "md_setting a, md_customer b",
          where = `a.customer_id = b.customer_id AND a.customer_id=${custId}`;
        var customer = await db_Select(select, table_name, where, null);
        const page_data = {
          title: "customer_setting",
          page_path: "/customer_setting/customer_setting",
          data: customer,
        };
        res.render("common/layouts/main", page_data);
      } catch (error) {
        res.redirect("/login");
      }
};

const show_customer = async (req, res) => {
  try {
    var custId = req.session.user.user_data.customer_id;
    let select = "DISTINCT a.customer_id,b.customer_name,a.adv_pay,a.grace_period_flag,a.grace_value",
      table_name = "md_setting a, md_customer b",
      whr = `a.customer_id = b.customer_id AND a.customer_id=${custId}`;
    const customer = await db_Select(select, table_name, whr, null);
    res.json(customer);
    // console.log(customer);
  } catch (error) {
    res.json({
      suc: 0,
      msg: [],
    });
  }
};

const edit_customer = async (req, res) => {
  var custId = req.session.user.user_data.customer_id;
  let select = "DISTINCT a.customer_id,b.customer_name,a.adv_pay,a.grace_period_flag,a.grace_value",
    table_name = "md_setting a, md_customer b",
    whr = `a.customer_id = b.customer_id AND a.customer_id=${custId}`;
  const resData = await db_Select(select, table_name, whr, null);
  console.log(resData);
  delete resData.sql;
  var viewData = {
    title: "Customer Setting",
    page_path: "/customer_setting/edit_customer_setting",
    data: resData.suc > 0 && resData.msg.length > 0 ? resData.msg[0] : [],
    customer_id: custId,
  };
  // console.log(viewData);
  res.render("common/layouts/main", viewData);
};

const edit_save_customer = async (req, res) => {
  try {
    const schema = Joi.object({
      cust_id: Joi.optional(),
      adv_pay_flag: Joi.string(),
      grace_flag: Joi.string(),
      grace_value: Joi.optional(),
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

    const datetime = dateFormat(new Date(), "yyyy-mm-dd");

    let fields = `adv_pay='${
      value.adv_pay_flag && value.adv_pay_flag == 'Y' ? 'Y' : 'N'
      }',grace_period_flag='${
        value.grace_flag == 'Y' ? 'Y' : 'N'
      }',grace_value=${value.grace_value != '' ? `'00:${value.grace_value}:00'` : 0},updated_at='${datetime}'`,
      where = `customer_id='${value.cust_id}'`;
    let res_dt2 = await db_Insert("md_setting", fields, null, where, 1);
    // console.log(res_dt2);
    req.flash("success", "Updated successful");
    res.redirect("/customer/customer_dt");
  } catch (error) {
    console.log(error);
    req.flash("error", "Data not Updated Successfully");
    res.redirect("/customer/customer_dt");
  }
};

module.exports = {cust_name, show_customer,edit_customer,edit_save_customer}