const Joi = require("joi");
const dateFormat = require("dateformat");
const { getAllCustomerList } = require("./customer.controller");
const { db_Select } = require("../../model/Master.model");

const transaction = async (req, res) => {
    try {
      var cust = await getAllCustomerList()
      const page_data = {
        title: "View Transaction details",
        page_path: "super_admin/view_transaction/view_transaction",
        customer: cust.suc > 0 ? cust.msg : null,
      };
      console.log(page_data, "999");
      res.render("common/layouts/main", page_data);
      // console.log(page_data, "...");
    } catch (error) {
      console.log(error);
      res.redirect("/superadmin_login");
    }
  };

  const transaction_show = (cust_id,frm_dt,to_dt) =>{
    return new Promise(async (resolve, reject) => {
            let select = "a.receipt_no,a.base_amt,a.advance_amt,a.cgst,a.sgst,a.paid_amt,b.vehicle_no,b.date_time_in, c.vehicle_out_id,c.device_id,c.date_time_out,d.vehicle_name,f.operator_name",
                table_name = "td_receipt a, td_vehicle_in b, td_vehicle_out c, md_vehicle d, md_user e, md_operator f",
                whr = `a.receipt_no = b.receipt_no AND a.receipt_no = c.receipt_no
                    AND c.vehicle_out_id = d.vehicle_id
                    AND a.user_id = e.id
                    AND e.user_id = f.user_id
                    AND b.car_out_flag = 'Y'
                    AND b.customer_id ='${cust_id}'
                    AND c.date_time_out between '${frm_dt}' and '${to_dt}'`;
             const trans_dt = await db_Select(select, table_name, whr, null);
             console.log(trans_dt);
            resolve(trans_dt);
      });
  };

  const transaction_dtls = async (req, res)=>{
    var data = req.body
    // console.log(data);
    var trans_dtls = await transaction_show(data.cust_id, data.frm_dt, data.to_dt)
    console.log(trans_dtls);
    res.send(trans_dtls)
  }

  module.exports = {transaction,transaction_show,transaction_dtls}