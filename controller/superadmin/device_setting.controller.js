const Joi = require("joi");
const dateFormat = require("dateformat");

const device = async(req,res)=>{
    try{
    //    var method = req.method
    //    var selected = {
    //      cust_id: method == 'POST' ? req.body.cust_name : ''
    //    }
    //    var cust = await getAllCustomerList(),
    //    loca = await getAllLocationList(),
    //    seller = await getAllSellerList(),
    //      operator_list = [];
    //    if(method == 'POST'){
    //      operator_list = await show_operator_dtls(selected.cust_id)
    //      operator_list = operator_list.suc > 0 ? operator_list.msg : []
    //    }
       const page_data = {
           title: "Device Setting details",
           page_path: "super_admin/device_setting/device_setting",
        //    data: operator_list,
        //    customer: cust.suc > 0 ? cust.msg : null,
        //    location: loca.suc > 0 ? loca.msg : null,
        //    seller: seller.suc > 0 ? seller.msg : null,
        //    selected
         };
         console.log(page_data,'lolo');
         res.render("common/layouts/main",page_data);
    } catch(error) {
      console.log(error);
      res.redirect("/superadmin_login");
    }
   };

   module.exports = {device}