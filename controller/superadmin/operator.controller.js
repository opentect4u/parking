const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");
const { getAllCustomerList } = require("./customer.controller");
const { getAllLocationList } = require("./location.controller");
const { getAllSellerList } = require("./seller.controller");
const bcrypt = require("bcrypt");
const logger = require('../../model/LoggerModel');

const getAllOperatorList = (id = 0,cust_id) => {
  return new Promise(async (resolve, reject) => {
      let select = "a.* ,b.*",
      table_name = "md_operator a, md_user b",
      whr = `a.customer_id = b.customer_id AND a.user_id = b.user_id AND a.customer_id=${cust_id} AND b.user_type='O' ${id > 0 ? `AND a.operator_id = ${id}` : ''}`,
      order = null;
      var operator = await db_Select(select,table_name,whr,order);
      // console.log(operator);
      resolve(operator)
  })
};

// const operator = async(req,res)=>{
//  try{
//     var method = req.method;
//     var user = req.session.user;

//     var selected = {
//       cust_id: method == 'POST' ? req.body.cust_name : ''
//     }

//     var cust = await getAllCustomerList(),
//     loca = await getAllLocationList(),
//     seller = await getAllSellerList(),
//       operator_list = [];

//     if(method == 'POST'){
//       operator_list = await show_operator_dtls(selected.cust_id)
//       operator_list = operator_list.suc > 0 ? operator_list.msg : []
//     }
//     const page_data = {
//         title: "Operator details",
//         page_path: "super_admin/operator/operator",
//         data: operator_list,
//         customer: cust.suc > 0 ? cust.msg : null,
//         location: loca.suc > 0 ? loca.msg : null,
//         seller: seller.suc > 0 ? seller.msg : null,
//         selected
//       };
//       // console.log(page_data,'lolo');
//       res.render("common/layouts/main",page_data);
//  } catch(error) {
//   //  console.log(error);
//   logger.error(err); // Log the error
//    res.redirect("/superadmin_login");
//  }
// };

const operator = async(req,res)=>{
 try{
    var method = req.method;
    var user = req.session.user;

    var selected = {
      cust_id: ""
    };

    var cust = await getAllCustomerList(),
    loca = await getAllLocationList(),
    seller = await getAllSellerList(),
      operator_list = [];
     
    if (user.userData.user_type === "S") {  
      selected.cust_id = method == "POST" ? req.body.cust_name : "";
    if(method == 'POST' && selected.cust_id){
      operator_list = await show_operator_dtls(selected.cust_id)
      operator_list = operator_list.suc > 0 ? operator_list.msg : []
    }
     } else if (user.userData.user_type === "A") {
      // Admin → auto load operators for their customer_id
      selected.cust_id = user.userData.customer_id;
      operator_list = await show_operator_dtls(selected.cust_id);
      operator_list = operator_list.suc > 0 ? operator_list.msg : [];
    }
    const page_data = {
        title: "Operator details",
        page_path: "super_admin/operator/operator",
        data: operator_list,
        customer: cust.suc > 0 ? cust.msg : null,
        location: loca.suc > 0 ? loca.msg : null,
        seller: seller.suc > 0 ? seller.msg : null,
        selected
      };
      // console.log(page_data,'lolo');
      res.render("common/layouts/main",page_data);
 } catch(error) {
   console.log(error);
  // logger.error(err); // Log the error
   res.redirect("/superadmin_login");
 }
};

const show_operator_dtls = (cust_id) => {
    return new Promise(async (resolve, reject) => {
      let select = "a.* ,b.*",
        table_name = "md_operator a, md_user b",
        whr = `a.customer_id = b.customer_id AND a.user_id = b.user_id AND a.customer_id=${cust_id} AND b.user_type='O'`;
      const operator_dt = await db_Select(select, table_name, whr, null);
      // console.log(operator_dt,'111');
      resolve(operator_dt)
    })
  };

  const operator_edit = async(req,res) =>{
    try {
      var data = req.query
      // console.log(data);
        var operator_dt = await getAllOperatorList(data.id,data.customer_id)
        var cust = await getAllCustomerList()
        var loca = await getAllLocationList()
        var seller = await getAllSellerList()
        const page_data = {
          id: data.id,
          customer_id: data.customer_id,
          title: "Operator Edit details",
          page_path: "/super_admin/operator/edit_operator",
          data: operator_dt.suc > 0 ? operator_dt.msg : null,
          customer: cust.suc > 0 ? cust.msg : null,
          location: loca.suc > 0 ? loca.msg : null,
          seller: seller.suc > 0 ? seller.msg : null,
        };
        // console.log(page_data);
        res.render("common/layouts/main",page_data);
      } catch (error) {
        // console.log(error);
        logger.error(err); // Log the error
        res.redirect("/superadmin_login");
      }
  };

  // const save_add_operator = async (req, res) => {
  //   try {
  //     const schema = Joi.object({
  //       id: Joi.required(),
  //       cust_id: Joi.optional(),
  //       cust_name: Joi.optional(),
  //       // seller_name: Joi.optional(),
  //       op_name: Joi.optional(),
  //       mobile: Joi.optional(),
  //       // loc_name: Joi.optional(),
  //       dev_id: Joi.optional(),
  //       pwd: Joi.optional(),
  //       allow_flag: Joi.optional(),
  //     });
  //     const { error, value } = schema.validate(req.body, { abortEarly: false });
  //     console.log(value,'value');
  //     if (error) {
  //       const errors = {};
  //       error.details.forEach((detail) => {
  //         errors[detail.context.key] = detail.message;
  //       });
  //       return res.json({ error: errors });
  //     }

  //     var user_type = req.session.user.userData.user_type;
  //     var user_name = req.session.user.userData.user_name;
  //     const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  //     var password = bcrypt.hashSync(value.pwd.toString(), 10);

  //       // Check if mobile number already exists
  //       let mobileWhere = `user_id = '${value.mobile}'`;
  //       if (value.id > 0) {
  //       mobileWhere += ` AND user_id != '${value.mobile}' AND customer_id != '${value.cust_id}'`;
  //       }
  //       const user = await db_Select("user_id", "md_user", mobileWhere, null);
  //       if (user.msg.length > 0) {
  //           req.flash("error", "Mobile number already exists");
  //           return res.redirect("/superadmin/operator");
  //       } else {

  
  //     let fields = value.id > 0 ? `operator_name='${value.op_name}',updated_by='${user_name}',updated_at='${datetime}'`: "(operator_name,user_id,customer_id,location_id,created_by,created_at)",
  //     values = `('${value.op_name}','${value.mobile}','${value.cust_name}','${value.cust_name}','${user_name}','${datetime}')`;
  //     where = value.id > 0 ? `customer_id='${value.cust_id}' AND operator_id='${value.id}'` : null;
  //     flag = value.id > 0 ? 1 : 0 ;
  //     var res_dt = await db_Insert("md_operator", fields, values, where, flag);
  //     // console.log(res_dt,'222');
  //     if(res_dt.suc > 0){
  //       let fields_1 = value.id > 0 ? `password='${password}',device_id='${value.dev_id}' ${user_type == 'S' ? `,allow_flag='${value.allow_flag == 'Y' ? 'Y' : 'N'}'` : ''},updated_by='${user_name}',updated_at='${datetime}'` : "(customer_id,seller_id,user_type,password,device_id,user_id,allow_flag,created_by,created_at)",
  //       values_1 = `('${value.cust_name}','0','O','${password}','${value.dev_id}','${value.mobile}','Y','${user_name}','${datetime}')`;
  //       where1 = value.id > 0 ? `customer_id='${value.cust_id}' AND user_id='${value.mobile}'` : null;
  //       flag = value.id > 0 ? 1 : 0 ;
  //       var res_dt_2 = await db_Insert("md_user", fields_1, values_1, where1, flag);
  //    }
  //     req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
  //     res.redirect("/superadmin/operator");
  //   //   res.send(res_dt)
  //       }
  //   } catch (error) {
  //     // console.log(error);
  //     logger.error(err); // Log the error
  //     req.flash("error", value.id > 0 ? "Data not updated Successfully" : "Data not saved Successfully");
  //     res.redirect("/superadmin/operator");
  //   }
  // };

// const check_mobile_no = async (req, res) => {
//   try {
//     const { mobile } = req.body;
//     console.log("Checking mobile:", mobile);

//     if (!mobile) {
//       return res.json({ exists: false, error: "Mobile number is required" });
//     }

//     // check in md_user
//     let userResult = await db_Select('*', 'md_user', `user_id='${mobile}'`, null);
//     console.log(userResult,'userrrr');
    

//     // check in md_operator
//     let operatorResult = await db_Select('*', 'md_operator', `user_id='${mobile}'`, null);
//     console.log(operatorResult,'uytr');
    

//     if ((userResult.msg && userResult.msg.length > 0) ||
//         (operatorResult.msg && operatorResult.msg.length > 0)) {
//       return res.json({ exists: true });
//     } else {
//       return res.json({ exists: false });
//     }

//   } catch (err) {
//     console.error("Error checking mobile:", err);
//     res.json({ exists: false, error: "Server error" });
//   }
// };


// const save_add_operator = async (req, res) => {
//   try {
//     const schema = Joi.object({
//       id: Joi.required(),
//       cust_id: Joi.optional(),
//       cust_name: Joi.optional(),
//       op_name: Joi.optional(),
//       mobile: Joi.optional(),
//       dev_id: Joi.optional(),
//       pwd: Joi.optional(),
//     });
//     const { error, value } = schema.validate(req.body, { abortEarly: false });
//     if (error) {
//       const errors = {};
//       error.details.forEach((detail) => {
//         errors[detail.context.key] = detail.message;
//       });
//       return res.json({ error: errors });
//     }

//     var user_type = req.session.user.userData.user_type;
//     var user_name = req.session.user.userData.user_name;
//     const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
//     var password = bcrypt.hashSync(value.pwd.toString(), 10);

//     // ✅ Only check duplicate mobile if superadmin can update it
//     if (user_type === "S") {
//       let mobileWhere = `user_id = '${value.mobile}'`;
//       if (value.id > 0) {
//         mobileWhere += ` AND customer_id != '${value.cust_id}'`;
//       }
//       const user = await db_Select("user_id", "md_user", mobileWhere, null);
//       if (user.msg.length > 0) {
//         req.flash("error", "Mobile number already exists");
//         return res.redirect("/superadmin/operator");
//       }
//     }

//     // ==========================
//     // Insert / Update md_operator
//     // ==========================
//     let fields =
//         value.id > 0
//           ? `operator_name='${value.op_name}',updated_by='${user_name}',updated_at='${datetime}'`
//           : "(operator_name,user_id,customer_id,location_id,created_by,created_at)",
//       values = `('${value.op_name}','${value.mobile}','${value.cust_name}','${value.cust_name}','${user_name}','${datetime}')`,
//       where =
//         value.id > 0
//           ? `customer_id='${value.cust_id}' AND operator_id='${value.id}'`
//           : null,
//       flag = value.id > 0 ? 1 : 0;

//     var res_dt = await db_Insert("md_operator", fields, values, where, flag);

//     if (res_dt.suc > 0) {
//       // ==========================
//       // Insert / Update md_user
//       // ==========================
//       let fields_1,
//         values_1,
//         where1,
//         flag;

//       if (value.id > 0) {
//         // 🔑 UPDATE CASE
//         if (user_type === "S") {
//           // Superadmin can update mobile also
//           fields_1 = `user_id='${value.mobile}',password='${password}',device_id='${value.dev_id}',updated_by='${user_name}',updated_at='${datetime}'`;
//         } else {
//           // Other users cannot update mobile
//           fields_1 = `password='${password}',device_id='${value.dev_id}',updated_by='${user_name}',updated_at='${datetime}'`;
//         }

//         where1 = `customer_id='${value.cust_id}' AND user_id='${value.mobile}'`;
//         flag = 1;
//       } else {
//         // INSERT CASE
//         fields_1 =
//           "(customer_id,seller_id,user_type,password,device_id,user_id,allow_flag,created_by,created_at)";
//         values_1 = `('${value.cust_name}','0','O','${password}','${value.dev_id}','${value.mobile}','Y','${user_name}','${datetime}')`;
//         where1 = null;
//         flag = 0;
//       }

//       var res_dt_2 = await db_Insert("md_user", fields_1, values_1, where1, flag);
//     }

//     req.flash(
//       "success",
//       value.id > 0 ? "Updated successfully" : "Saved successfully"
//     );
//     res.redirect("/superadmin/operator");
//   } catch (err) {
//     console.error(err);
//     req.flash(
//       "error",
//       value.id > 0
//         ? "Data not updated Successfully"
//         : "Data not saved Successfully"
//     );
//     res.redirect("/superadmin/operator");
//   }
// };


  const save_add_operator = async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.required(),
        cust_id: Joi.optional(),
        cust_name: Joi.optional(),
        op_name: Joi.optional(),
        mobile: Joi.optional(),
        dev_id: Joi.optional(),
        pwd: Joi.optional(),
        allow_flag: Joi.optional(),
        // allow_flag:Joi.string().valid('Y', 'N').optional(),
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      // console.log(value,'value');
      if (error) {
        const errors = {};
        error.details.forEach((detail) => {
          errors[detail.context.key] = detail.message;
        });
        return res.json({ error: errors });
      }

      var user_type = req.session.user.userData.user_type;
      var user_name = req.session.user.userData.user_name;
      const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var password = bcrypt.hashSync(value.pwd.toString(), 10);

        // Check if mobile number already exists
        let operatorWhere = `user_id = '${value.mobile}'`;
        if (value.id > 0) {
        operatorWhere += ` AND operator_id != '${value.id}'`;
        }
        const operatorUser = await db_Select("user_id", "md_operator", operatorWhere, null);

        let mobileWhere = `user_id = '${value.mobile}' AND customer_id = '${value.cust_id}'`;
        if (value.id > 0) {
        mobileWhere += ` AND user_id != '${value.mobile}' AND customer_id != '${value.cust_id}'`;
        }
        const user = await db_Select("user_id", "md_user", mobileWhere, null);

        if (operatorUser.msg.length > 0 || user.msg.length > 0) {
            req.flash("error", "Mobile number already exists");
            return res.redirect("/superadmin/operator");
        } else {
        
        // ===== old data (for logging if update) =====
        let oldData = null;
        if (value.id > 0) {
          const existing = await db_Select(
            "a.*,b.*",
            "md_operator a LEFT JOIN md_user b ON a.customer_id = b.customer_id AND a.user_id = b.user_id",
            `a.customer_id='${value.cust_id}' AND a.operator_id='${value.id}'`
          );
          oldData = existing.msg[0] || null;
        }

        // else {
        // ==== Insert / Update operator ====   
      let fields = value.id > 0 ? `operator_name='${value.op_name}',updated_by='${user_name}',updated_at='${datetime}'`: "(operator_name,user_id,customer_id,location_id,created_by,created_at)",
      values = `('${value.op_name}','${value.mobile}','${value.cust_name}','${value.cust_name}','${user_name}','${datetime}')`;
      where = value.id > 0 ? `customer_id='${value.cust_id}' AND operator_id='${value.id}'` : null;
      flag = value.id > 0 ? 1 : 0 ;
      var res_dt = await db_Insert("md_operator", fields, values, where, flag);
      // console.log(res_dt,'222');

      if(res_dt.suc > 0){
        let fields_1 = value.id > 0 ? `password='${password}',device_id='${value.dev_id}' ${user_type == 'S' ? `,allow_flag='${value.allow_flag == 'Y' ? 'Y' : 'N'}'` : ''},updated_by='${user_name}',updated_at='${datetime}'` : "(customer_id,seller_id,user_type,password,device_id,user_id,allow_flag,created_by,created_at)",
        values_1 = `('${value.cust_name}','0','O','${password}','${value.dev_id}','${value.mobile}','Y','${user_name}','${datetime}')`;
        where1 = value.id > 0 ? `customer_id='${value.cust_id}' AND user_id='${value.mobile}'` : null;
        flag = value.id > 0 ? 1 : 0 ;
        var res_dt_2 = await db_Insert("md_user", fields_1, values_1, where1, flag);
     }

       // normalize allow_flag before update
      let allowFlag =
      user_type == "S"
    ? (value.allow_flag !== undefined ? value.allow_flag : oldData ? oldData.allow_flag : "Y")
    : "Y";

      // ==== Logging ====
      if (oldData) {
      const changes = [];
      if (oldData.operator_name !== value.op_name)
        changes.push(`operator_name: '${oldData.operator_name}' → '${value.op_name}'`);
      if (oldData.user_id !== value.mobile)
        changes.push(`mobile: '${oldData.user_id}' → '${value.mobile}'`);
      if (oldData.device_id !== value.dev_id)
        changes.push(`device_id: '${oldData.device_id}' → '${value.dev_id}'`);
      if (value.pwd) changes.push("password: [updated]");
      // log allow_flag changes only for superadmin
      // if (user_type == "S" && oldData.allow_flag !== value.allow_flag) {
      //   changes.push(`allow_flag: '${oldData.allow_flag}' → '${value.allow_flag}'`);
      // }
       if (user_type == "S" && oldData.allow_flag !== allowFlag) {
       changes.push(`allow_flag: '${oldData.allow_flag}' → '${allowFlag}'`);
       }

      logger.info(
        `${user_name} Updated Operator [CustID: ${value.cust_id}, ID: ${value.id}] Fields changed: ${changes.join(", ")}`
      );
      // req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
      req.flash("success", "Updated successfully");
      } else {
      const createdFields = [
        `customer_id: '${value.cust_name}'`,
        `operator_name: '${value.op_name}'`,
        `mobile: '${value.mobile}'`,
        `device_id: '${value.dev_id}'`,
        "password: [created]",
      ];
       // log allow_flag only for superadmin
      if (user_type == "S") {
        createdFields.push(`allow_flag: '${value.allow_flag || "Y"}'`);
      }
      logger.info(
        `${user_name} Created Operator [CustID: ${value.cust_name}] Fields: ${createdFields.join(", ")}`
      );
      req.flash("success", "Saved successfully");
    }
      res.redirect("/superadmin/operator");
    //   res.send(res_dt)
        }
    } catch (error) {
      // console.log(error);
      logger.error(error); // Log the error
      const isUpdate = req.body && req.body.id > 0;
      req.flash("error", isUpdate ? "Data not updated Successfully" : "Data not saved Successfully");
      res.redirect("/superadmin/operator");
    }
  };

const check_mobile_no = async (req, res) => {
  try {
    const { mobile, customer_id } = req.body;

    if (!mobile || !customer_id) {
      return res.json({ exists: false, error: "Mobile number and customer_id are required" });
    }

    // Example: check in md_operator for same customer_id + mobile
    let operatorResult = await db_Select(
      '*',
      'md_operator',
      `user_id='${mobile}' AND customer_id='${customer_id}'`,
      null
    );

    if (operatorResult.msg && operatorResult.msg.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }

  } catch (err) {
    console.error("Error checking mobile:", err);
    res.json({ exists: false, error: "Server error" });
  }
};


module.exports = {operator,show_operator_dtls,operator_edit,save_add_operator, check_mobile_no}