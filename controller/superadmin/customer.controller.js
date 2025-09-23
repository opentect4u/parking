const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");
const { getAllSellerList } = require("./seller.controller");
const { getAllLocationList } = require("./location.controller");
const bcrypt = require("bcrypt");
const logger = require('../../model/LoggerModel');

// const getAllCustomerList = (id = 0, sailer_id = 0) => {
//   return new Promise(async (resolve, reject) => {
//     var select =
//         "a.*,b.seller_name,b.seller_addr,b.seller_mob,b.location_id,c.*",
//       table_name = "md_customer a, md_seller b, md_locations c",
//       where = `a.seller_id = b.seller_id
//         AND a.location_id = c.location_id ${
//           id > 0 ? `AND a.customer_id=${id}` : ""
//         } ${sailer_id > 0 ? `AND a.seller_id=${sailer_id}` : ""}`,
//       order = `Order By a.seller_id ASC`;
//     var cust = await db_Select(select, table_name, where, order);
//     // console.log(cust,'log');
//     resolve(cust);
//   });
// };

const getAllCustomerList = (id = 0) => {
  return new Promise(async (resolve, reject) => {
    var select =
        "a.*,c.*",
      table_name = "md_customer a, md_locations c",
      where = `a.location_id = c.location_id ${
          id > 0 ? `AND a.customer_id=${id}` : ""
        }`,
      order = null;
    var cust = await db_Select(select, table_name, where, order);
    // console.log(cust,'log');
    resolve(cust);
  });
};

const getAllCustomerData = (id = 0) => {
  return new Promise(async (resolve, reject) => {
    var select =
        "a.*,b.*,c.*",
      table_name = "md_customer a, md_super_admin b, md_locations c",
      where = `a.customer_id = b.customer_id AND a.location_id = c.location_id ${
          id > 0 ? `AND a.customer_id=${id}` : ""
        }`,
      order = null;
    var cust = await db_Select(select, table_name, where, order);
    // console.log(cust,'log');
    resolve(cust);
  });
};

const customer = async (req, res) => {
  try {
    var cust = await getAllCustomerList();
    var seller = await getAllSellerList();
    var loc = await getAllLocationList();
    const page_data = {
      title: "Customer details",
      page_path: "/super_admin/customer/customer",
      data: cust.suc > 0 ? cust.msg : null,
      location: loc.suc > 0 ? loc.msg : null,
      sell: seller.suc > 0 ? seller.msg : null,
    };
    // console.log(page_data);
    res.render("common/layouts/main", page_data);
  } catch (error) {
    // console.log(error);
    logger.error(err); // Log the error
    res.redirect("/superadmin_login");
  }
};

const customer_edit = async (req, res) => {
  try {
    var data = req.query;
    // console.log(data,'lolo');
    // var cust_list = await getAllCustomerList(data.id);
    var cust = await getAllCustomerList(data.id)
    var seller = await getAllSellerList();
    var loc = await getAllLocationList();
    const page_data = {
      id: data.id,
      title: "Customer Edit details",
      page_path: "/super_admin/customer/edit_customer",
      data: cust.suc > 0 ? cust.msg : null,
      // custs: cust_list.suc > 0 ? cust_list.msg : null,
      sell: seller.suc > 0 ? seller.msg : null,
      location: loc.suc > 0 ? loc.msg : null,
    };
    // console.log(page_data, "lalal");
    res.render("common/layouts/main", page_data);
  } catch (error) {
    // console.log(error);
    logger.error(err); // Log the error
    res.redirect("/superadmin_login");
  }
};

// const save_add_customer = async (req, res) => {
//   try {
//     const schema = Joi.object({
//       id: Joi.required(),
//       sell_name: Joi.required(),
//       cust_name: Joi.required(),
//       loc_name: Joi.required(),
//       phone: Joi.required(),
//       email: Joi.required(),
//       dev_mode: Joi.required(),
//       no_device: Joi.required(),
//       cust_type: Joi.required(),
//       dev_type: Joi.optional(),
//       password: Joi.optional(),
//       cust_add: Joi.required(),
//     });
//     const { error, value } = schema.validate(req.body, { abortEarly: false });
//     // console.log(value);
//     if (error) {
//       const errors = {};
//       error.details.forEach((detail) => {
//         errors[detail.context.key] = detail.message;
//       });
//       return res.json({ error: errors });
//     }
//     var user_name = req.session.user.userData.user_name;
//     const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
//     var pwd = bcrypt.hashSync(value.password, 10);

//     let fields =
//         value.id > 0
//           ? `seller_id='${value.sell_name}',customer_name='${value.cust_name}',location_id='${value.loc_name}',mobile_no='${value.phone}',email='${value.email}',cust_addr='${value.cust_add}',dev_mod='${value.dev_mode}',no_device='${value.no_device}',customer_type='${value.cust_type}',updated_by='${user_name}',updated_at='${datetime}'`
//           : "(seller_id,customer_name,location_id,mobile_no,email,cust_addr,dev_mod,no_device,customer_type,device_type,created_by,created_at)",
//       values = `('${value.sell_name}','${value.cust_name}','${value.loc_name}','${value.phone}','${value.email}','${value.cust_add}','${value.dev_mode}','${value.no_device}','${value.cust_type}','H','${user_name}','${datetime}')`;
//     let res_dt = await db_Insert(
//       "md_customer",
//       fields,
//       values,
//       value.id > 0 ? `customer_id=${value.id}` : null,
//       value.id > 0 ? 1 : 0
//     );
//     // res_dt['customer_id']=
//     // console.log(res_dt,'ressss');
//       var cust_id = value.id > 0 ? value.id : res_dt.lastId.insertId
//     if(res_dt.suc > 0){
//       let fields1 =
//       value.id > 0
//         ? `seller_id='${value.sell_name}',password='${pwd}',user_id='${value.phone}',updated_by='${user_name}',updated_at='${datetime}'`
//         : "(seller_id,customer_id,user_type,password,user_id,allow_flag,created_by,created_at)",
//     values1 = `('${value.sell_name}','${cust_id}','C','${pwd}','${value.phone}','Y','${user_name}','${datetime}')`;
//     let user_dt = await db_Insert(
//     "md_user",
//     fields1,
//     values1,
//     value.id > 0 ? `id=${value.id}` : null,
//     value.id > 0 ? 1 : 0
//   );
//     }

//     // console.log("========customer==========", res_dt);
//     req.flash(
//       "success",
//       value.id > 0 ? "Updated successfully" : "Saved successfully"
//     );
//     res.redirect("/superadmin/customer");
//       // res.send(res_dt,'resssss')
//   } catch (error) {
//     // console.log(error);
//     logger.error(err); // Log the error
//     req.flash(
//       "error",
//       value.id > 0
//         ? "Data not updated Successfully"
//         : "Data not saved Successfully"
//     );
//     res.redirect("/superadmin/customer");
//   }
// };

// const save_add_customer = async (req, res) => {
//   try {
//     const schema = Joi.object({
//       id: Joi.required(),
//       cust_name: Joi.required(),
//       user_id: Joi.required(),
//       user_name: Joi.required(),
//       pass: Joi.required(),
//       phone: Joi.required(),
//       email: Joi.optional(),
//       no_device: Joi.required(),
//       rec_no: Joi.required(),
//       cust_add: Joi.required(),
//     });
//     const { error, value } = schema.validate(req.body, { abortEarly: false });
//     console.log(value,'customer_value');

//     if (error) {
//       const errors = {};
//       error.details.forEach((detail) => {
//         errors[detail.context.key] = detail.message;
//       });
//       return res.json({ error: errors });
//     }

//     var user_name = req.session.user.userData.user_name;
//     const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

//     // let location_id;

//     if (value.id > 0) {
//       await db_Insert(
//         "md_locations",
//         `location='${value.cust_name}',updated_by='${user_name}',updated_at='${datetime}'`,
//         null,
//         `location_id=${value.id}`,
//         1
//       );
//       // location_id = value.id;
//     } else {
//       // Insert new location
//       let res_loc = await db_Insert(
//         "md_locations",
//         "(location, created_by, created_at)",
//         `('${value.cust_name}','${user_name}','${datetime}')`,
//         null,
//         0
//       );
//       location_id = res_loc.insertId; // <-- get generated location_id
//     }


//     // var fields = data.id > 0 ? 
//     //     `customer_name='${value.cust_name}',mobile_no='${value.phone}',cust_addr='${value.cust_add}',no_device='${value.no_device}',receipt_no='${value.rec_no}',updated_by='${user_name}',updated_at='${datetime}'` : `()`,
//     //     values = null;
//     // let res_dt = await db_Insert(
//     //   "md_customer",
//     //   fields,
//     //   values,
//     //  `customer_id=${value.id}`,
//     //   1
//     // );

//     /** =============================
//      *  2. Handle md_customer
//      *  ============================= */
//     if (value.id > 0) {
//       await db_Insert(
//         "md_customer",
//         `customer_name='${value.cust_name}', mobile_no='${value.phone}', email='${value.email}',cust_addr='${value.cust_add}',no_device='${value.no_device}', receipt_no='${value.rec_no}', updated_by='${user_name}', updated_at='${datetime}'`,
//         null,
//         `customer_id=${value.id}`,
//         1
//       );
//       // customer_id = value.id;
//     } else {
//       let res_cust = await db_Insert(
//         "md_customer",
//         "(customer_id,seller_id,customer_name,location_id,mobile_no,email,cust_addr,dev_mod,no_device,receipt_no, customer_type,device_type, created_by, created_at)",
//         `('${location_id}','0','${value.cust_name}','${location_id}','${value.phone}','${value.email}','${value.cust_add}','F','${value.no_device}','${value.rec_no}','T','H','${user_name}','${datetime}')`,
//         null,
//         0
//       );
//       // customer_id = res_cust.insertId; // <-- get generated customer_id
//     }

//     /** =============================
//      *  3. Handle md_super_admin
//      *  ============================= */
//     if (value.id > 0) {
//       await db_Insert(
//         "md_super_admin",
//         `user_id='${value.user_id}', user_name='${value.user_name}', password='${value.pass}', 
//          user_mobile_no='${value.phone}', updated_by='${user_name}', updated_at='${datetime}'`,
//         null,
//         `customer_id=${customer_id}`,
//         1
//       );
//     } else {
//       await db_Insert(
//         "md_super_admin",
//         "(customer_id,user_type,user_id,password,user_name,user_mobile_no,allow_flag,created_by, created_at)",
//         `('${location_id}','A','${value.user_id}','${value.pass}','${value.user_name}','${value.phone}','Y','${user_name}','${datetime}')`,
//         null,
//         0
//       );
//     }

//     // console.log("========customer==========", res_dt);
//     req.flash(
//       "success","Updated successfully"
//     );
//     res.redirect("/superadmin/customer");
//       // res.send(res_dt,'resssss')
//   } catch (error) {
//     console.log(error);
//     // logger.error(err); // Log the error
//     req.flash(
//       "error","Data not updated Successfully"    );
//     res.redirect("/superadmin/customer");
//   }
// };

// const save_add_customer = async (req, res) => {
//   try {
//     const schema = Joi.object({
//       id: Joi.optional().default(0),
//       cust_name: Joi.required(),
//       // user_id: Joi.required(),
//       // user_name: Joi.required(),
//       // pass: Joi.required(),
//       phone: Joi.required(),
//       // email: Joi.optional(),
//       // dev_mode: Joi.required(),
//       no_device: Joi.required(),
//       rec_no: Joi.required(),
//       // cust_type: Joi.required(),
//       // dev_type: Joi.required(),
//       cust_add: Joi.required(),
//     });
//     const { error, value } = schema.validate(req.body, { abortEarly: false });
//     console.log(value,'customer_value');

//     // return res.send(value)

//     if (error) {
//       const errors = {};
//       error.details.forEach((detail) => {
//         errors[detail.context.key] = detail.message;
//       });
//       return res.json({ error: errors });
//     }

//     var user_name = req.session.user.userData.user_name;
//     const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
//     // var pwd = bcrypt.hashSync(value.pass, 10);

//     // let location_id;

//     // var location_id = value.id > 0 ? value.id : 0
//     // var table_name = 'md_locations',
//     // fields = location_id > 0 ? `loction='${value.cust_name}',updated_by='${user_name}',updated_at='${datetime}'` : '(loction, created_by, created_at)',
//     // values = `('${value.cust_name}','${user_name}','${datetime}')`,
//     // whr = location_id > 0 ? `location_id=${value.id}` : null,
//     // flag = location_id > 0 ? 1 : 0;
//     // let location_save = await db_Insert(table_name, fields, values, whr, flag)

//     // if(location_save.suc > 0){
//     //   location_id > 0 ? '' : location_id = location_save.lastId.insertId

//     //   const chkCustData = await db_Select('customer_id', 'md_customer', `customer_id=${location_id}`, null)
//     //   let has_id = chkCustData.suc > 0 && chkCustData.msg.length > 0 ? location_id : 0
//     //   var table_name = 'md_customer',
//     //   fields = has_id > 0 ? `customer_name='${value.cust_name}', mobile_no='${value.phone}', email='${value.email}',cust_addr='${value.cust_add}',no_device='${value.no_device}', receipt_no='${value.rec_no}', updated_by='${user_name}', updated_at='${datetime}'` : "(customer_id,seller_id,customer_name,location_id,mobile_no,email,cust_addr,dev_mod,no_device,receipt_no, customer_type,device_type, created_by, created_at)",
//     //   values = `('${location_id}','0','${value.cust_name}','${location_id}','${value.phone}','${value.email}','${value.cust_add}','${value.dev_mode}','${value.no_device}','${value.rec_no}','${value.cust_type}','${value.dev_type}','${user_name}','${datetime}')`,
//     //   whr = has_id > 0 ? `customer_id=${has_id}` : null,
//     //   flag = has_id > 0 ? 1 : 0;

//     //   let custSave = await db_Insert(table_name, fields, values, whr, flag)

//     //   if(custSave.suc > 0){
//     //     const chkUserData = await db_Select('sl_no', 'md_super_admin', `customer_id=${location_id}`, null)
//     //     let has_id = chkUserData.suc > 0 && chkUserData.msg.length > 0 ? chkUserData.msg[0].sl_no : 0
//     //     var table_name = 'md_super_admin',
//     //     fields = has_id > 0 ? `user_id='${value.user_id}', user_name='${value.user_name}', password='${pwd}', user_mobile_no='${value.phone}', updated_by='${user_name}', updated_at='${datetime}'` : "(customer_id,user_type,user_id,password,user_name,user_mobile_no,allow_flag,created_by, created_at)",
//     //     values = `('${location_id}','A','${value.user_id}','${pwd}','${value.user_name}','${value.phone}','Y','${user_name}','${datetime}')`,
//     //     whr = has_id > 0 ? `sl_no=${has_id}` : null,
//     //     flag = has_id > 0 ? 1 : 0;

//     //     let userSave = await db_Insert(table_name, fields, values, whr, flag)
//     //   }

//     // }

//     // console.log("========customer==========", res_dt);
//     req.flash(
//       "success","Updated successfully"
//     );
//     res.redirect("/superadmin/customer");
//       // res.send(res_dt,'resssss')
//   } catch (error) {
//     console.log(error);
//     // logger.error(err); // Log the error
//     req.flash(
//       "error","Data not updated Successfully"    );
//     res.redirect("/superadmin/customer");
//   }
// };


// const save_add_customer = async (req, res) => {
//   try {
//     const schema = Joi.object({
//       id: Joi.required(),
//       // sell_name: Joi.required(),
//       cust_name: Joi.required(),
//       // loc_name: Joi.required(),
//       phone: Joi.required(),
//       // email: Joi.required(),
//       // dev_mode: Joi.required(),
//       no_device: Joi.required(),
//       rec_no: Joi.required(),
//       // cust_type: Joi.required(),
//       // dev_type: Joi.optional(),
//       // password: Joi.optional(),
//       cust_add: Joi.required(),
//     });
//     const { error, value } = schema.validate(req.body, { abortEarly: false });
//     // console.log(value);
//     if (error) {
//       const errors = {};
//       error.details.forEach((detail) => {
//         errors[detail.context.key] = detail.message;
//       });
//       return res.json({ error: errors });
//     }
//     var user_name = req.session.user.userData.user_name;
//     const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
//     // var pwd = bcrypt.hashSync(value.password, 10);

//     let fields =
//         // value.id > 0
//         //   ? 
//           `customer_name='${value.cust_name}',mobile_no='${value.phone}',cust_addr='${value.cust_add}',no_device='${value.no_device}',receipt_no='${value.rec_no}',updated_by='${user_name}',updated_at='${datetime}'`
//           // : "(seller_id,customer_name,location_id,mobile_no,email,cust_addr,dev_mod,no_device,customer_type,device_type,created_by,created_at)",
//       // values = `('${value.sell_name}','${value.cust_name}','${value.loc_name}','${value.phone}','${value.email}','${value.cust_add}','${value.dev_mode}','${value.no_device}','${value.cust_type}','H','${user_name}','${datetime}')`;
//     let res_dt = await db_Insert(
//       "md_customer",
//       fields,
//       null,
//       `customer_id=${value.id}`,
//       1
//     );
//     // res_dt['customer_id']=
//     // console.log(res_dt,'ressss');
//   //     var cust_id = value.id > 0 ? value.id : res_dt.lastId.insertId
//   //   if(res_dt.suc > 0){
//   //     let fields1 =
//   //     value.id > 0
//   //       ? `seller_id='${value.sell_name}',password='${pwd}',user_id='${value.phone}',updated_by='${user_name}',updated_at='${datetime}'`
//   //       : "(seller_id,customer_id,user_type,password,user_id,allow_flag,created_by,created_at)",
//   //   values1 = `('${value.sell_name}','${cust_id}','C','${pwd}','${value.phone}','Y','${user_name}','${datetime}')`;
//   //   let user_dt = await db_Insert(
//   //   "md_user",
//   //   fields1,
//   //   values1,
//   //   value.id > 0 ? `id=${value.id}` : null,
//   //   value.id > 0 ? 1 : 0
//   // );
//   //   }

//     // console.log("========customer==========", res_dt);
//     req.flash(
//       "success",
//       value.id > 0 ? "Updated successfully" : "Saved successfully"
//     );

//     //activity log
//     const action = value.id > 0 ? "Updated" : "Created";
//     logger.info(`${user_name} ${action} customer [ID: ${value.id}] [Name: ${value.cust_name}]`)
//     res.redirect("/superadmin/customer");
//       // res.send(res_dt,'resssss')
//   } catch (error) {
//     // console.log(error);
//     logger.error(error); // Log the error
//     req.flash(
//       "error",
//       value.id > 0
//         ? "Data not updated Successfully"
//         : "Data not saved Successfully"
//     );
//     res.redirect("/superadmin/customer");
//   }
// };

const save_add_customer = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.required(),
      cust_name: Joi.required(),
      phone: Joi.required(),
      no_device: Joi.required(),
      rec_no: Joi.required(),
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

     if (value.id > 0) {
       // Get existing customer data
      const existingCustomer = await db_Select("*", "md_customer", `customer_id=${value.id}`);
      const oldData = existingCustomer.msg;
      // console.log(oldData,'old');
      

// Determine which fields changed
      const changes = [];
      if (oldData[0].customer_name !== value.cust_name) changes.push(`customer_name: '${oldData[0].customer_name}' → '${value.cust_name}'`);
      if (oldData[0].mobile_no !== value.phone) changes.push(`mobile_no: '${oldData[0].mobile_no}' → '${value.phone}'`);
      if (oldData[0].cust_addr !== value.cust_add) changes.push(`cust_addr: '${oldData[0].cust_addr}' → '${value.cust_add}'`);
      if (oldData[0].no_device != value.no_device) changes.push(`no_device: '${oldData[0].no_device}' → '${value.no_device}'`);
      if (oldData[0].receipt_no != value.rec_no) changes.push(`receipt_no: '${oldData[0].receipt_no}' → '${value.rec_no}'`);

      // Update the customer
      var fields = `customer_name='${value.cust_name}',mobile_no='${value.phone}',cust_addr='${value.cust_add}',no_device='${value.no_device}',receipt_no='${value.rec_no}',updated_by='${user_name}',updated_at='${datetime}'`;
      await db_Insert("md_customer", fields, null, `customer_id=${value.id}`, 1);

      // Update the location
      var fields = `location='${value.cust_name}',updated_by='${user_name}',updated_at='${datetime}'`;
      await db_Insert("md_locations", fields, null, `location_id=${value.id}`, 1);

      // Log update with field-level changes
      logger.info(`${user_name} Updated customer [ID: ${value.id}] [Name: ${value.cust_name}] Fields changed: ${changes.join(", ")}`);

    } else {
      // New customer
      let fields = `(customer_name, mobile_no, cust_addr, no_device, receipt_no, updated_by, updated_at) VALUES ('${value.cust_name}', '${value.phone}', '${value.cust_add}', '${value.no_device}', '${value.rec_no}', '${user_name}', '${datetime}')`;
      await db_Insert("md_customer", null, fields, null, 0);

      logger.info(`${user_name} Created customer [Name: ${value.cust_name}]`);
    }

    // let fields =
    //     // value.id > 0
    //     //   ? 
    //       `customer_name='${value.cust_name}',mobile_no='${value.phone}',cust_addr='${value.cust_add}',no_device='${value.no_device}',receipt_no='${value.rec_no}',updated_by='${user_name}',updated_at='${datetime}'`
    //       // : "(seller_id,customer_name,location_id,mobile_no,email,cust_addr,dev_mod,no_device,customer_type,device_type,created_by,created_at)",
    //   // values = `('${value.sell_name}','${value.cust_name}','${value.loc_name}','${value.phone}','${value.email}','${value.cust_add}','${value.dev_mode}','${value.no_device}','${value.cust_type}','H','${user_name}','${datetime}')`;
    // let res_dt = await db_Insert(
    //   "md_customer",
    //   fields,
    //   null,
    //   `customer_id=${value.id}`,
    //   1
    // );
    // res_dt['customer_id']=
    // console.log(res_dt,'ressss');
  //     var cust_id = value.id > 0 ? value.id : res_dt.lastId.insertId
  //   if(res_dt.suc > 0){
  //     let fields1 =
  //     value.id > 0
  //       ? `seller_id='${value.sell_name}',password='${pwd}',user_id='${value.phone}',updated_by='${user_name}',updated_at='${datetime}'`
  //       : "(seller_id,customer_id,user_type,password,user_id,allow_flag,created_by,created_at)",
  //   values1 = `('${value.sell_name}','${cust_id}','C','${pwd}','${value.phone}','Y','${user_name}','${datetime}')`;
  //   let user_dt = await db_Insert(
  //   "md_user",
  //   fields1,
  //   values1,
  //   value.id > 0 ? `id=${value.id}` : null,
  //   value.id > 0 ? 1 : 0
  // );
  //   }

    // console.log("========customer==========", res_dt);
    req.flash(
      "success",
      value.id > 0 ? "Updated successfully" : "Saved successfully"
    );
    res.redirect("/superadmin/customer");
    //activity log
    // const action = value.id > 0 ? "Updated" : "Created";
    // logger.info(`${user_name} ${action} customer [ID: ${value.id}] [Name: ${value.cust_name}]`)
      // res.send(res_dt,'resssss')
  } catch (error) {
    // console.log(error);
    logger.error(error); // Log the error
      const isUpdate = req.body && req.body.id > 0;
    req.flash(
      "error",
      isUpdate
        ? "Data not updated Successfully"
        : "Data not saved Successfully"
    );
    res.redirect("/superadmin/customer");
  }
};

module.exports = {
  customer,
  customer_edit,
  save_add_customer,
  getAllCustomerList,
};
