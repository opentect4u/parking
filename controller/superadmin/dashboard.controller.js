const { db_Select } = require("../../model/Master.model");
const { getAllLocationList } = require("./location.controller");

const getAllcustomerlist = (id = 0) => {
    return new Promise(async (resolve, reject) => {
       var select = "COUNT(*)",
       table_name = "md_customer",
       where = `location_id = '${id}'`,
       order=null;
       var customer_data = await db_Select(select,table_name,where,order);
       console.log(customer_data);
       
        resolve(customer_data)
    })
}

// const dashboard_data = async(req,res) =>{
//     try {
//        var loca = await getAllLocationList()
//        var customer = await getAllcustomerlist()

//        // Group customers by location_id
//     const customersByLocation = {};
//     customer.forEach(cust => {
//       if (!customersByLocation[cust.location_id]) {
//         customersByLocation[cust.location_id] = [];
//       }
//       customersByLocation[cust.location_id].push(cust);
//     });

//         const page_data = {
//           title: "Dashboard details",
//           page_path: "/super_admin/dashboard/dashboard",
//           data: loca,
//           customer_data: customer,
//           customersByLocation: customersByLocation
//         };
//         console.log(data);
//         res.render("common/layouts/main",page_data);
//       } catch (error) {
//         // console.log(error);
//         // logger.error(err); // Log the error
//         res.redirect("/superadmin_login");
//       }
// };

const dashboard_data = async (req, res) => {
  try {
    const loca = await getAllLocationList();
    const page_data = {
      title: "Dashboard details",
      page_path: "/super_admin/dashboard/dashboard",
      data: loca,
    };
    // console.log(page_data);
    res.render("common/layouts/main", page_data);
  } catch (err) {
    console.error(err);
    // logger.error(err);
    res.redirect("/superadmin_login");
  }
};

// const dashboard_page = async (req, res) => {
//   try {
//     const locationId = req.query.location_id;

//     const operator = await db_Select(
//       "COUNT(*) as op_cnt",
//       "md_user",
//       `customer_id='${locationId}' AND user_type = 'O'`
//     );

//     const receipt = await db_Select(
//       "COUNT(*) as rec_cnt",
//       "td_vehicle_in",
//       `customer_id='${locationId}'`
//     );

//     const device = await db_Select(
//       "COUNT(*) as dev_cnt",
//       "md_customer",
//       `customer_id='${locationId}'`
//     );

//     // 👉 If you want totalAmount, calculate it here
//     const amount = await db_Select(
//       "SUM(paid_amt) total_amt",
//       `td_receipt a LEFT JOIN td_vehicle_in b ON a.user_id = b.user_id_in AND a.receipt_no = b.receipt_no`,
//       `customer_id='${locationId}'`
//     );

//     res.json({
//       receipts: receipt.msg[0].rec_cnt || 0,
//       operators: operator.msg[0].op_cnt || 0,
//       devices: device.msg[0].dev_cnt || 0,
//       totalAmount: amount.msg[0].total_amt || 0
//     });

//     // console.log("Dashboard data:", { receipt, operator, device });

//   } catch (err) {
//     console.error(err);
//     res.json({ error: "Server error" });
//   }
// };

const dashboard_page = async (req, res) => {
  try {
    const locationId = req.query.location_id;

    const operator = await db_Select(
      "COUNT(*) as op_cnt",
      "md_user",
      `customer_id='${locationId}' AND user_type = 'O'`
    );

    const receipt = await db_Select(
      "COUNT(*) as rec_cnt",
      "td_vehicle_in",
      `customer_id='${locationId}'`
    );

    const device = await db_Select(
      "COUNT(*) as dev_cnt",
      "md_customer",
      `customer_id='${locationId}'`
    );

    // 👉 If you want totalAmount, calculate it here
    const amount = await db_Select(
      "SUM(paid_amt)+Sum(Other_charges) total_amt",
      `td_receipt a LEFT JOIN td_vehicle_in b ON a.user_id = b.user_id_in AND a.receipt_no = b.receipt_no`,
      `customer_id='${locationId}'`
    );

    // ✅ Daily receipts
    const dailyReceipts = await db_Select(
      "DATE(created_at) as date, COUNT(*) as count",
      "td_vehicle_in",
      `customer_id='${locationId}' GROUP BY DATE(created_at) ORDER BY DATE(created_at) ASC`
    );

    // ✅ Monthly receipts
    const monthlyReceipts = await db_Select(
      "MONTH(created_at) as month, COUNT(*) as count",
      "td_vehicle_in",
      `customer_id='${locationId}' GROUP BY MONTH(created_at) ORDER BY MONTH(created_at) ASC`
    );

    res.json({
      receipts: receipt.msg[0].rec_cnt || 0,
      operators: operator.msg[0].op_cnt || 0,
      devices: device.msg[0].dev_cnt || 0,
      totalAmount: amount.msg[0].total_amt || 0,
      dailyReceipts: dailyReceipts.msg || [],
      monthlyReceipts: monthlyReceipts.msg || []
    });

    // console.log("Dashboard data:", { receipt, operator, device });

  } catch (err) {
    console.error(err);
    res.json({ error: "Server error" });
  }
};

module.exports = {dashboard_data, dashboard_page}