const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Insert, db_Select } = require("../../model/Master.model");
const bcrypt = require("bcrypt");


const vehicle = async (req, res) => {
  try {
    page_data = {
      title: "blank",
      page_path: "vehicle/vehicle_add",
    };
    req.flash("success", "Blank Page");
    res.render("common/layouts/main", page_data);
  } catch (err) {
    res.render("/login");
  }
};

// View Create and Save a new Operator
const operator_add = async (req, res) => {
  try {
    page_data = {
      title: "blank",
      page_path: "operator/add",
    };
    req.flash("success", "Blank Page");
    res.render("common/layouts/main", page_data);
  } catch (err) {
    res.redirect("/login");
  }
};

// Create and Save a new Operator
const operator_add_post = async (req, res) => {
  try {
    const schema = Joi.object({
      operator_name: Joi.string().required(),
      password: Joi.string().required(),
      device_id: Joi.string().required(),
      user_id: Joi.required(),
      location_id: Joi.number().required(),
      c_password: Joi.string().valid(Joi.ref("password")).required().strict(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.context.key] = detail.message;
      });
      res.flash("error", "Invalid credentials");
      res.redirect("/operator/add");
    }
    //req.flash('error', "Bank Add Successful");
    req.flash("success", "operator created successfully");
    res.redirect("/operator/add");
    // console.log("===========================================================");
  } catch (err) {
    res.flash("error", "Error inserting data");
    res.redirect("/operator/add");
  }
};

const password_change = async (req, res) => {
  try {
    var custId = req.session.user.user_data.customer_id;
    let wher = `customer_id=${custId}`;
    var setting = await db_Select("*", "md_setting", wher, null);
    const page_data = {
      title: "password",
      page_path: "/settings/password",
      data: setting,
    };
    // console.log(setting);
    res.render("common/layouts/main", page_data);
  } catch (error) {
    res.redirect("/login");
  }
};

const report_pwd = async (req, res) => {
  var data = req.body;
  //   console.log(data);
  var custId = req.session.user.user_data.customer_id;

  var select = "*",
    table_name = "md_setting",
    whr = `app_id = '${data.dev_id}' AND customer_id=${custId}`,
    order = null;
  var pwd_data = await db_Select(select, table_name, whr, order);
  const page_data = {
    title: "Report Password",
    page_path: "/settings/password",
    data: pwd_data,
  };
  // console.log(pwd_data);
  res.render("common/layouts/main", page_data);
};



const save_report_password = async (req, res) => {
  try {
    var data = req.body;
    console.log(data);

    const userData = req.user;
    var custId = req.session.user.user_data.customer_id;

    // console.log(userData,'1234');
    const datetime = dateFormat(new Date(), "yyyy-mm-dd");
    var password = bcrypt.hashSync(data.pwd, 10);
    let fields = `report_password_flag='${data.report_pwd == 'Y' ? 'Y' : 'N'}',password = '${data.report_pwd == 'Y' ? password : '' }',modified_by=${custId},updated_at='${datetime}'`,
      where = `customer_id='${custId}' AND app_id='${data.app_id}'`;
    let res_dt = await db_Insert("md_setting", fields, null, where, 1);
    console.log(res_dt);
    req.flash("success", "Updated successful");
    res.redirect("/password");
  } catch (error) {
    // console.log(error);
    req.flash("error", "Data not Updated Successfully");
    res.send({ suc: 0, msg: error });
  }
};

const location_name = async (req, res) => {
    var location = await db_Select("*", "md_locations", null, null);
    res.send(location);
    // console.log(location);
};

const my_profile_save = async (req, res) =>{
  try {
    var data = req.body;
    // console.log(data);

    const userData = req.user;
    const datetime = dateFormat(new Date(), "yyyy-mm-dd");
    var custId = req.session.user.user_data.customer_id;


    let fields = `location_id = ${data.loc_id},mobile_no = ${data.phone},email = '${data.email_id}',cust_addr = '${data.cust_add}',updated_at='${datetime}'`,
      where = `customer_id='${custId}'`;
    let res_dt = await db_Insert("md_customer", fields, null, where, 1);
    if(res_dt.suc > 0){
      req.session.user.user_data.location_id = data.loc_id
      req.session.user.user_data.mobile_no = data.phone
      req.session.user.user_data.email = data.email_id
      req.session.user.user_data.cust_addr = data.cust_add
    }
    // console.log(res_dt);
    res.redirect("/report/details_report");
  } catch (error) {
    // console.log(error);
    res.send({ suc: 0, msg: error });
  }
};

const password = async (req, res) => {
  const user_data = req.session.user.user_data;
  // console.log(user_data,"123456");
  const datetime = dateFormat(new Date(), "yyyy-mm-dd");
  
  var data = req.body,result;
  // console.log(data,"1234");

  var select = "id,password",
  table_name = "md_user",
  whr = `id='${user_data.id}'`;
  var res_dt = await db_Select(select,table_name,whr,null)
  // console.log(res_dt,"1234");

  if(res_dt.suc > 0) {
    if(res_dt.msg.length > 0) {
      if (await bcrypt.compare(data.old_pwd, res_dt.msg[0].password)) {
        var pass = bcrypt.hashSync(data.new_pwd, 10);
        var table_name = "md_user",
        fields = `password = '${pass}', updated_at='${datetime}'`,
        where2 = `id = '${user_data.id}'`,
        flag = 1;
        var forget_pass = await db_Insert(table_name,fields,null,where2,flag)
        result = forget_pass
        res.redirect("/logout");
      }else {
        res.redirect("/report/details_report");
      }
    }else {
        res.redirect("/report/details_report");
      }
  }else {
    res.redirect("/report/details_report");
  }
}

module.exports = {
  vehicle,
  operator_add,
  operator_add_post,
  password_change,
  save_report_password,
  report_pwd,
  location_name,
  my_profile_save,
  password,
};
