const Joi = require("joi");
const dateFormat = require("dateformat");
const { getAllCustomerList } = require("./customer.controller");
const { db_Select, db_Insert } = require("../../model/Master.model");
const logger = require('../../model/LoggerModel');

const getAllShiftList = (id = 0,cust_id) => {
    return new Promise(async (resolve, reject) => {
      var shift= await db_Select("*","md_shift",id > 0 ? `customer_id = ${cust_id} AND shift_id = ${id}` : null,
        null
      );
    //   console.log(shift,'22');
      resolve(shift);
    });
  };

const shift = async(req,res)=>{
    try{
       var method = req.method;
       var user = req.session.user;

       var selected = {
        //  cust_id: method == 'POST' ? req.body.cust_name : ''
         cust_id: ""
       }

       var cust = await getAllCustomerList(),
         shift_list = [];

      if (user.userData.user_type === "S") {  
      selected.cust_id = method == "POST" ? req.body.cust_name : "";
       if(method == 'POST' && selected.cust_id){
         shift_list = await show_shift_dtls(selected.cust_id)
         shift_list = shift_list.suc > 0 ? shift_list.msg : []
       }
       } else if (user.userData.user_type === "A") {
             // Admin → auto load operators for their customer_id
             selected.cust_id = user.userData.customer_id;
              shift_list = await show_shift_dtls(selected.cust_id)
             shift_list = shift_list.suc > 0 ? shift_list.msg : []
           }
       const page_data = {
           title: "Shift details",
           page_path: "super_admin/shift/shift",
           data: shift_list,
           customer: cust.suc > 0 ? cust.msg : null,
           selected
         };
        //  console.log(page_data,'lolo');
         res.render("common/layouts/main",page_data);
    } catch(error) {
    //   console.log(error);
    logger.error(err); // Log the error
      res.redirect("/superadmin_login");
    }
   };

   const show_shift_dtls = (cust_id) => {
    return new Promise(async (resolve, reject) => {
      let select = "*",
        table_name = "md_shift",
        whr = `customer_id=${cust_id}`,
        order =  `ORDER BY FIELD(shift_name, 'Morning', 'Evening', 'Night')`;
      const shift_dt = await db_Select(select, table_name, whr, order);
    //   console.log(shift_dt,'111');
      resolve(shift_dt)
    })
  };   

  const shift_edit = async(req,res) =>{
    try {
      var data = req.query
    //   console.log(data);
        var shift_dt = await getAllShiftList(data.id,data.customer_id)
        var cust = await getAllCustomerList()
        const page_data = {
          id: data.id,
          customer_id: data.customer_id,
          title: "Shift Edit details",
          page_path: "/super_admin/shift/edit_shift",
          data: shift_dt.suc > 0 ? shift_dt.msg : null,
          customer: cust.suc > 0 ? cust.msg : null,
        };
        // console.log(page_data,'p');
        res.render("common/layouts/main",page_data);
      } catch (error) {
        // console.log(error);
        logger.error(err); // Log the error
        res.redirect("/superadmin_login");
      }
  };  


  const save_add_shift = async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.optional(),
        cust_id: Joi.optional(),
        shift_name: Joi.optional(),
        frm_time: Joi.optional(),
        to_time: Joi.optional(),
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

      // ===== old data (for logging if update) =====
        let oldData = null;
        if (value.id > 0) {
          const existing = await db_Select(
            "*",
            "md_shift",
            `customer_id='${value.cust_id}' AND shift_id='${value.id}'`
          );
          oldData = existing.msg[0] || null;
        }
  
      let fields = value.id > 0 ? `shift_name='${value.shift_name}',f_time='${value.frm_time}',t_time='${value.to_time}',modified_by='${user_name}',updated_at='${datetime}'` : "(customer_id,shift_name,f_time,t_time,created_by,created_at)",
        values = `('${value.cust_id}','${value.shift_name}','${value.frm_time}','${value.to_time}','${user_name}','${datetime}')`;
      let res_dt = await db_Insert("md_shift", fields, values, value.id > 0 ? `shift_id=${value.id} AND customer_id = ${value.cust_id}` : null, value.id > 0 ? 1 : 0);
      // console.log("========shift==========", res_dt);

      // ==== Logging ====
      if (oldData) {
      const changes = [];
      if (oldData.shift_name !== value.shift_name)
        changes.push(`shift_name: '${oldData.shift_name}' → '${value.shift_name}'`);
      if (oldData.f_time !== value.frm_time)
        changes.push(`f_time: '${oldData.f_time}' → '${value.frm_time}'`);
      if (oldData.t_time !== value.to_time)
        changes.push(`t_time: '${oldData.t_time}' → '${value.to_time}'`);
      logger.info(
        `${user_name} Updated Operator [CustID: ${value.cust_id}, ID: ${value.id}] Fields changed: ${changes.join(", ")}`
      );
      req.flash("success", "Updated successfully");
        } else {
      const createdFields = [
        `customer_id: '${value.cust_id}'`,
        `shift_name: '${value.shift_name}'`,
        `f_time: '${value.frm_time}'`,
        `t_time: '${value.to_time}'`,
      ];
      logger.info(
        `${user_name} Created Operator [CustID: ${value.cust_id}] Fields: ${createdFields.join(", ")}`
      );
      req.flash("success", "Saved successfully");
    }
      // req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
      res.redirect("/superadmin/shift");
    //   res.send(res_dt)
    } catch (error) {
      // console.log(error);
      logger.error(error); // Log the error
      const isUpdate = req.body && req.body.id > 0;
      req.flash("error", value.id > 0 ? "Data not updated Successfully" : "Data not saved Successfully");
      res.redirect("/superadmin/shift");
    }
  };  

module.exports = {shift,show_shift_dtls,shift_edit,getAllShiftList,save_add_shift}   