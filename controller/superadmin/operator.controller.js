const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");
const { getAllCustomerList } = require("./customer.controller");
const { getAllLocationList } = require("./location.controller");
const { getAllSellerList } = require("./seller.controller");
const bcrypt = require("bcrypt");

const getAllOperatorList = (id = 0,cust_id) => {
  return new Promise(async (resolve, reject) => {
      let select = "a.* ,b.*",
      table_name = "md_operator a, md_user b",
      whr = `a.customer_id = b.customer_id AND a.user_id = b.user_id AND a.customer_id=${cust_id} AND b.user_type='O' ${id > 0 ? `AND a.operator_id = ${id}` : ''}`,
      order = null;
      var operator = await db_Select(select,table_name,whr,order);
      console.log(operator);
      resolve(operator)
  })
};

const operator = async(req,res)=>{
 try{
    var method = req.method
    var selected = {
      cust_id: method == 'POST' ? req.body.cust_name : ''
    }
    var cust = await getAllCustomerList(),
    loca = await getAllLocationList(),
    seller = await getAllSellerList(),
      operator_list = [];
    if(method == 'POST'){
      operator_list = await show_operator_dtls(selected.cust_id)
      operator_list = operator_list.suc > 0 ? operator_list.msg : []
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
      console.log(page_data,'lolo');
      res.render("common/layouts/main",page_data);
 } catch(error) {
   console.log(error);
   res.redirect("/superadmin_login");
 }
};

const show_operator_dtls = (cust_id) => {
    return new Promise(async (resolve, reject) => {
      let select = "a.* ,b.*",
        table_name = "md_operator a, md_user b",
        whr = `a.customer_id = b.customer_id AND a.user_id = b.user_id AND a.customer_id=${cust_id} AND b.user_type='O'`;
      const operator_dt = await db_Select(select, table_name, whr, null);
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
        console.log(page_data);
        res.render("common/layouts/main",page_data);
      } catch (error) {
        console.log(error);
        res.redirect("/superadmin_login");
      }
  };

  const save_add_operator = async (req, res) => {
    try {
      const schema = Joi.object({
        cust_id: Joi.optional(),
        id: Joi.required(),
        cust_name: Joi.optional(),
        seller_name: Joi.optional(),
        op_name: Joi.required(),
        mobile: Joi.required(),
        loc_name: Joi.required(),
        dev_id: Joi.required(),
        pwd: Joi.required(),
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
      var user_name = req.session.user.userData.user_name;
      const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var password = bcrypt.hashSync(value.pwd.toString(), 10);

  
      let fields = value.id > 0 ? `operator_name='${value.op_name}',user_id='${value.mobile}',customer_id='${value.cust_id}',location_id='${value.loc_name}',updated_by='${user_name}',updated_at='${datetime}'`: "(operator_name,user_id,customer_id,location_id,created_by,created_at)",
      values = `('${value.op_name}','${value.mobile}','${value.cust_id}','${value.loc_name}','${user_name}','${datetime}')`;
      where = value.id > 0 ? `customer_id='${value.cust_id}' AND operator_id='${value.id}'` : null;
      flag = value.id > 0 ? 1 : 0 ;
      var res_dt = await db_Insert("md_operator", fields, values, where, flag);

      if(res_dt.suc > 0){
        let fields_1 = value.id > 0 ? `customer_id='${value.cust_id}',seller_id='${value.seller_name}',user_type='O',password='${password}',device_id='${value.dev_id}',user_id='${value.mobile}',allow_flag='Y',updated_by='${user_name}',updated_at='${datetime}'` : "(customer_id,seller_id,user_type,password,device_id,user_id,allow_flag,created_by,created_at)",
        values = `('${value.cust_id}','${value.seller_name}','O','${password}',${value.dev_id}','${value.mobile}','Y','${user_name}','${datetime}')`;
     where1 = value.id > 0 ? `customer_id='${value.cust_id}' AND id='${value.id}'` : null;
  
    var res_dt_2 = await db_Insert("md_user", fields_1, null, where1, 1);
     }
      req.flash("success", value.id > 0 ? "Updated successfully" : "Saved successfully");
      res.redirect("/superadmin/operator");
    //   res.send(res_dt)
    } catch (error) {
      console.log(error);
      req.flash("error", value.id > 0 ? "Data not updated Successfully" : "Data not saved Successfully");
      res.redirect("/superadmin/operator");
    }
  };
  

module.exports = {operator,show_operator_dtls,operator_edit,save_add_operator}