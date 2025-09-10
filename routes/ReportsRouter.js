const { AuthCheckedMW } = require("../middleware/AuthChecked.middleware");
const { db_Select } = require("../model/Master.model");

const express = require("express"),
  reportRouter = express.Router(),
  dateFormat = require("dateformat");

reportRouter.get("/", AuthCheckedMW, async (req, res) => {
  res.redirect("/report/unbilled_report");
});

reportRouter.get("/details_report", AuthCheckedMW, async (req, res) => {
  var data = {
    title: "Detail Report",
    page_path: "reports/details_report",
    dtFormat: dateFormat,
  };
  res.render("common/layouts/main", data);
});

reportRouter.get("/details_report_new", AuthCheckedMW, async (req, res) => {
  var customer = await getcustomerlist();
  var custId = customer.length > 0 ? customer[0].cust_id : null;
  var operator = [];
    if (custId) {
      operator = await getoperatorlist(custId);  // ✅ pass customer id
    }

  var data = {
    title: "Detail Report",
    page_path: "reports/detail_report_new.ejs",
    dtFormat: dateFormat,
    data: customer,
    operators: operator
  };
  res.render("common/layouts/main", data);
});

reportRouter.post("/get_operators_by_location", AuthCheckedMW, async (req, res) => {
  try {
    const { custId } = req.body;
    const operators = await getoperatorlist(custId);  // ✅ pass custId
    res.send({ suc: operators.length, msg: operators });
  } catch (err) {
    console.error(err);
    res.send({ suc: 0, msg: [] });
  }
});



reportRouter.post("/get_details_report", AuthCheckedMW, async (req, res) => {
  var custId = req.session.user.user_data.customer_id,
    userType = req.session.user.user_data.user_type;

  var data = req.body;
  var select = `receiptNo, date_time_in, mc_srl_no, vehicleType, vehicle_no, opratorName, date_time_out, paid_amt, mc_srl_no_out`,
    table_name = "td_backlog_data",
    whr = `DATE(date_time_out) BETWEEN '${data.frm_dt}' AND '${data.to_dt}'`,
    order = "ORDER BY receiptNo";
  var res_dt = await db_Select(select, table_name, whr, order);
  res.send(res_dt);
});

// reportRouter.post(
//   "/get_details_report_new",
//   AuthCheckedMW,
//   async (req, res) => {

//     var data = req.body;
//     console.log(data,'kk');
    
//     if(data.pay_mode == 'A'){
//       var select = `a.receipt_no, a.date_time_in, a.device_id, d.vehicle_name, a.vehicle_no, b.date_time_out, b.device_id device_id_out, c.base_amt, c.advance_amt, c.cgst, c.sgst, c.paid_amt, c.pay_mode, f.operator_name`,
//       table_name =
//         "td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f",
//       whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.car_out_flag = 'Y' AND b.date_time_out BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${data.custId}'`,
//       order = "ORDER BY a.receipt_no";
//     var res_dt = await db_Select(select, table_name, whr, order);
//     console.log(res_dt);
//     res.send(res_dt);
//     }else {
//       var select = `a.receipt_no, a.date_time_in, a.device_id, d.vehicle_name, a.vehicle_no, b.date_time_out, b.device_id device_id_out, c.base_amt, c.advance_amt, c.cgst, c.sgst, c.paid_amt, c.pay_mode, f.operator_name`,
//       table_name =
//         "td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f",
//       whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.car_out_flag = 'Y' AND b.date_time_out BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${data.custId}' AND c.pay_mode = '${data.pay_mode}'`,
//       order = "ORDER BY a.receipt_no";
//     var res_dt = await db_Select(select, table_name, whr, order);
//     console.log(res_dt);
//     res.send(res_dt);
//     }
   
//   }
// );

reportRouter.post(
  "/get_details_report_new",
  AuthCheckedMW,
  async (req, res) => {
    try {
      const data = req.body;
      // console.log(data, "kk");

      let select = `
        a.receipt_no, a.date_time_in, a.device_id, d.vehicle_name, a.vehicle_no,
        b.date_time_out, b.device_id device_id_out, c.base_amt, c.advance_amt,
        c.cgst, c.sgst, c.paid_amt, c.other_charges, c.pay_mode, f.operator_name
      `;

      let table_name = `
        td_vehicle_in a, td_vehicle_out b, td_receipt c,
        md_vehicle d, md_user e, md_operator f
      `;

      let whr = `
        a.receipt_no=b.receipt_no
        AND a.receipt_no=c.receipt_no
        AND a.vehicle_id=d.vehicle_id
        AND a.user_id_in=e.id
        AND e.user_id=f.user_id
        AND a.car_out_flag='Y'
        AND b.date_time_out BETWEEN '${data.frm_dt}' AND '${data.to_dt}'
        AND a.customer_id='${data.custId}'
      `;

      // ✅ Handle filters
      if (data.pay_mode && data.pay_mode !== "A") {
        whr += ` AND c.pay_mode='${data.pay_mode}'`;
      }

      if (data.operator_id && data.operator_id !== "A") {
        whr += ` AND f.operator_id='${data.operator_id}'`;
      }

      let order = "ORDER BY a.receipt_no";

      let res_dt = await db_Select(select, table_name, whr, order);
      console.log(res_dt);
      res.send(res_dt);

    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Server error" });
    }
  }
);

const getcustomerlist = () => {
    return new Promise(async (resolve, reject) => {
       var select = "customer_id,customer_name",
       table_name = "md_customer",
       where = null,
       order=null;
       var customer_data = await db_Select(select,table_name,where,order);
       console.log(customer_data);
        resolve(customer_data)
    })
  };

  const getoperatorlist = (custId) => {
    return new Promise(async (resolve, reject) => {
       var select = "operator_id,operator_name",
       table_name = "md_operator",
       where = `customer_id = '${custId}'`,
       order=null;
       var operator_data = await db_Select(select,table_name,where,order);
       console.log(operator_data);
        resolve(operator_data)
    })
  };

reportRouter.get("/unbilled_report", AuthCheckedMW, async (req, res) => {
  var customer = await getcustomerlist();
  var data = {
    title: "Unbilled Report",
    page_path: "reports/unbilled_report.ejs",
    dtFormat: dateFormat,
    data: customer
  };
  console.log(data);
  
  res.render("common/layouts/main", data);
});

reportRouter.post("/get_unbilled_report", AuthCheckedMW, async (req, res) => {
  // var custId = req.session.user.user_data.customer_id,
  //   userType = req.session.user.user_data.user_type;
    console.log(req.session.user.user_data);
    

  var data = req.body;
  var select = `a.receipt_no, a.date_time_in, a.device_id, d.vehicle_name, a.vehicle_no, f.operator_name, g.advance_amt`,
    table_name = `td_vehicle_in a JOIN  md_vehicle d ON  a.vehicle_id=d.vehicle_id
        JOIN md_user e  ON a.user_id_in=e.id 
        JOIN md_operator f ON e.user_id=f.user_id  
        LEFT JOIN td_receipt g ON a.receipt_no = g.receipt_no`,
    whr = `a.car_out_flag = 'N' AND a.date_time_in BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${data.custId}'`,
    order = "ORDER BY a.receipt_no";
  var res_dt = await db_Select(select, table_name, whr, order);
  res.send(res_dt);
});

reportRouter.get("/veh_wise_repo", AuthCheckedMW, async (req, res) => {
  var data = {
    title: "Veichle Wise Report",
    page_path: "reports/veh_wise_repo",
    dtFormat: dateFormat,
  };
  res.render("common/layouts/main", data);
});

reportRouter.get("/veh_wise_repo_new", AuthCheckedMW, async (req, res) => {
  var customer = await getcustomerlist()
  var data = {
    title: "Vehicle Wise Report",
    page_path: "reports/veh_wise_repo_new",
    dtFormat: dateFormat,
    data: customer
  };
  res.render("common/layouts/main", data);
});

reportRouter.post("/get_veh_wise_report", AuthCheckedMW, async (req, res) => {
  var data = req.body;
  var select = `mc_srl_no_out, vehicleType, COUNT(receiptNo) tot_vehi, SUM(paid_amt) tot_amt`,
    table_name = "td_backlog_data",
    whr = `DATE(date_time_out) BETWEEN '${data.frm_dt}' AND '${data.to_dt}'`,
    order = "GROUP BY vehicleType, mc_srl_no_out";
  var res_dt = await db_Select(select, table_name, whr, order);
  res.send(res_dt);
});

reportRouter.post(
  "/get_veh_wise_report_new",
  AuthCheckedMW,
  async (req, res) => {
    // var custId = req.session.user.user_data.customer_id,
    //   userType = req.session.user.user_data.user_type;

    var data = req.body;
    var select = `d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) paid_amt, SUM(c.advance_amt) advance_amt, SUM(c.base_amt) base_amt,SUM(c.cgst) cgst, SUM(c.sgst) sgst, SUM(c.other_charges) other_charges`,
      table_name =
        "td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d",
      whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.car_out_flag = 'Y' AND b.date_time_out BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${data.custId}'`,
      order = "GROUP BY a.vehicle_id";
    var res_dt = await db_Select(select, table_name, whr, order);
    // console.log(res_dt);
    res.send(res_dt);
  }
);

reportRouter.get("/dev_wise_repo", AuthCheckedMW, async (req, res) => {
  var data = {
    title: "Device Wise Report",
    page_path: "reports/dev_wise_repo",
    dtFormat: dateFormat,
  };
  res.render("common/layouts/main", data);
});

reportRouter.get("/dev_wise_repo_new", AuthCheckedMW, async (req, res) => {
  var customer = await getcustomerlist()
  var data = {
    title: "Device Wise Report",
    page_path: "reports/dev_wise_repo_new",
    dtFormat: dateFormat,
    data: customer
  };
  res.render("common/layouts/main", data);
});

reportRouter.post("/get_dev_wise_report", AuthCheckedMW, async (req, res) => {
  var data = req.body;
  var select = `vehicleType, COUNT(receiptNo) tot_vehi, SUM(paid_amt) tot_amt`,
    table_name = "td_backlog_data",
    whr = `DATE(date_time_out) BETWEEN '${data.frm_dt}' AND '${data.to_dt}'`,
    order = "GROUP BY vehicleType";
  var res_dt = await db_Select(select, table_name, whr, order);
  res.send(res_dt);
});

reportRouter.post(
  "/get_dev_wise_report_new",
  AuthCheckedMW,
  async (req, res) => {
    // var custId = req.session.user.user_data.customer_id,
    //   userType = req.session.user.user_data.user_type;

    var data = req.body;
    var select = `b.device_id mc_srl_no_out,COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) paid_amt, SUM(c.advance_amt) advance_amt,SUM(c.base_amt) base_amt, SUM(c.cgst) cgst, SUM(c.sgst) sgst, SUM(c.other_charges) other_charges`,
      table_name =
        "td_vehicle_in a, td_vehicle_out b, td_receipt c",
      whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.car_out_flag = 'Y' AND b.date_time_out BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${data.custId}'`,
      order = "GROUP BY b.device_id";
    var res_dt = await db_Select(select, table_name, whr, order);
    console.log(res_dt,'res-st');
    res.send(res_dt);
  }
);

reportRouter.get("/operator_wise_repo_new", AuthCheckedMW, async (req, res) => {
  var customer = await getcustomerlist()
  var data = {
    title: "Operator Wise Report",
    page_path: "reports/operator_wise_repo_new",
    dtFormat: dateFormat,
    data: customer
  };
  res.render("common/layouts/main", data);
});

reportRouter.post(
  "/get_operator_wise_repo_new",
  AuthCheckedMW,
  async (req, res) => {
    // var custId = req.session.user.user_data.customer_id,
    //   userType = req.session.user.user_data.user_type;

    var data = req.body;
    var select = `b.device_id mc_srl_no_out, d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) paid_amt, SUM(c.advance_amt) as advance_amt,SUM(c.base_amt) base_amt, SUM(c.cgst) cgst, SUM(c.sgst) sgst, SUM(c.other_charges) other_charges, f.operator_name opratorName`,
      table_name =
        "td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f",
      whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.car_out_flag = 'Y' AND b.date_time_out BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${data.custId}'`;
    order = "GROUP BY a.user_id_in,b.device_id,d.vehicle_name";
    var res_dt = await db_Select(select, table_name, whr, order);
    console.log(res_dt);
    res.send(res_dt);
  }
);

reportRouter.get("/combine_repo_new", AuthCheckedMW, async (req, res) => {
  var custId = req.session.user.user_data.customer_id,
    combineData = await db_Select("vehicle_id , customer_id, vehicle_name, vehicle_icon","md_vehicle",`customer_id=${custId}`,
    );
  var data = {
    title: "Combine Report (Vehicle)",
    page_path: "reports/combine_report_new",
    dtFormat: dateFormat,
    combineData: combineData,
  };
  res.render("common/layouts/main", data);
});

reportRouter.post("/get_combine_repo_new",  AuthCheckedMW,async (req, res) => {
      var custId = req.session.user.user_data.customer_id,
        userType = req.session.user.user_data.user_type;
  
      var data = req.body;
      var select = `f.operator_name, a.device_id,sum(c.advance_amt)advance_amt,sum(c.paid_amt)paid_amt,SUM(c.base_amt) base_amt,SUM(c.cgst) cgst, SUM(c.sgst) sgst`,
        table_name = "td_vehicle_in a,md_vehicle b,td_receipt c,td_vehicle_out d,md_user e,md_operator f",
        whr = `a.vehicle_id = b.vehicle_id and a.receipt_no = c.receipt_no
        and   a.receipt_no = d.receipt_no and c.user_id = e.id
        and   e.user_id = f.user_id and a.customer_id = '${custId}'
        and   a.vehicle_id = '${data.vehicle_id}' and d.date_time_out between '${data.frm_dt}' and '${data.to_dt}'`
        order = "Group BY f.operator_name,a.device_id";
      var res_dt = await db_Select(select, table_name, whr, order);
      console.log(res_dt);
      res.send(res_dt);
    }
  );

  reportRouter.get("/combine_repo_dev_new", AuthCheckedMW, async (req, res) => {
    var custId = req.session.user.user_data.customer_id,
      combineData_dev = await db_Select("*","md_setting",`customer_id=${custId}`,
      );
    var data = {
      title: "Combine Report (Device)",
      page_path: "reports/combine_report_dev_new",
      dtFormat: dateFormat,
      combineData_dev: combineData_dev,
    };
    // console.log(combineData_dev);
    res.render("common/layouts/main", data);
  });

  reportRouter.post("/get_combine_repo_dev_new",  AuthCheckedMW,async (req, res) => {
    var custId = req.session.user.user_data.customer_id,
      userType = req.session.user.user_data.user_type;

    var data = req.body;
    var select = `f.operator_name, a.device_id, b.vehicle_name vehicleType, sum(c.advance_amt)advance_amt, sum(c.paid_amt)paid_amt,SUM(c.base_amt) base_amt,SUM(c.cgst) cgst, SUM(c.sgst) sgst`,
      table_name = "td_vehicle_in a,md_vehicle b,td_receipt c,td_vehicle_out d,md_user e,md_operator f",
      whr = `a.vehicle_id = b.vehicle_id 
      and    a.receipt_no = c.receipt_no
      and    a.receipt_no = d.receipt_no 
      and    c.user_id = e.id
      and    e.user_id = f.user_id 
      and    a.customer_id = '${custId}'
      and    d.device_id = '${data.device_id}' and d.date_time_out between '${data.frm_dt}' and '${data.to_dt}'`
      order = "Group BY f.operator_name,d.device_id,b.vehicle_name";
    var res_dt = await db_Select(select, table_name, whr, order);
    // console.log(res_dt);
    res.send(res_dt);
  }
);

reportRouter.get("/usr_wise_repo", AuthCheckedMW, async (req, res) => {
  var data = {
    title: "User Wise Report",
    page_path: "reports/usr_wise_repo",
    dtFormat: dateFormat,
  };
  res.render("common/layouts/main", data);
});

reportRouter.get("/usr_wise_repo_new", AuthCheckedMW, async (req, res) => {
  var data = {
    title: "User Wise Report",
    page_path: "reports/usr_wise_repo_new",
    dtFormat: dateFormat,
  };
  res.render("common/layouts/main", data);
});

reportRouter.post("/get_user_wise_report", AuthCheckedMW, async (req, res) => {
  var data = req.body;
  var select = `opratorName, mc_srl_no_out, COUNT(receiptNo) tot_vehi, SUM(paid_amt) tot_amt`,
    table_name = "td_backlog_data",
    whr = `DATE(date_time_out) BETWEEN '${data.frm_dt}' AND '${data.to_dt}'`,
    order = "GROUP BY opratorName, mc_srl_no_out";
  var res_dt = await db_Select(select, table_name, whr, order);
  res.send(res_dt);
});

reportRouter.post(
  "/get_user_wise_report_new",
  AuthCheckedMW,
  async (req, res) => {
    var custId = req.session.user.user_data.customer_id,
      userType = req.session.user.user_data.user_type;

    var data = req.body;
    var select = `b.device_id mc_srl_no_out, d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) paid_amt, SUM(c.advance_amt) advance_amt,SUM(c.base_amt) base_amt,SUM(c.cgst) cgst, SUM(c.sgst) sgst, f.operator_name opratorName`,
      table_name =
        "td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f",
      whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.car_out_flag = 'Y' AND b.date_time_out BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${custId}'`,
      order = "GROUP BY a.user_id_in";
    var res_dt = await db_Select(select, table_name, whr, order);
    res.send(res_dt);
  }
);

reportRouter.get("/shift_wise_repo", AuthCheckedMW, async (req, res) => {
  // var custId = req.session.user.user_data.customer_id;
  // var shiftData = await db_Select(
  //     "shift_id, shift_name, f_time, t_time",
  //     "md_shift",
  //     `customer_id=${custId}`,
  //     "ORDER BY f_time"
  //   );
  var customer = await getcustomerlist();  
  var data = {
    title: "Shiftwise Report",
    page_path: "reports/shift_report_new",
    dtFormat: dateFormat,
    data: customer,
    // shiftData: shiftData,
  };
  res.render("common/layouts/main", data);
});

reportRouter.post(
  "/get_shift_wise_repo_new",
  AuthCheckedMW,
  async (req, res) => {

    var data = req.body;
    var select = `b.device_id mc_srl_no_out, d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) paid_amt,SUM(c.advance_amt) AS advance_amt,SUM(c.base_amt) base_amt, SUM(c.cgst) cgst, SUM(c.sgst) sgst,SUM(c.other_charges) other_charges, f.operator_name opratorName, g.shift_name, g.f_time, g.t_time`,
      table_name =
        "td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f, md_shift g",
      whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.customer_id = g.customer_id AND TIME(b.date_time_out) BETWEEN g.f_time AND g.t_time AND a.car_out_flag = 'Y' AND b.date_time_out BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${data.custId}'`;
    order = `GROUP BY a.user_id_in,b.device_id,d.vehicle_name,f.operator_name,g.shift_name, g.f_time, g.t_time
    ORDER BY g.f_time`;
    var res_dt = await db_Select(select, table_name, whr, order);
    // console.log(res_dt);
    res.send(res_dt);
  }
);


reportRouter.post("/shift_wise_repo", AuthCheckedMW, async (req, res) => {
  var custId = req.session.user.user_data.customer_id,
    userType = req.session.user.user_data.user_type;

  var data = req.body;

  let shift_time = await db_Select(
    "f_time, t_time",
    "md_shift",
    `shift_id=${data.shift_id}`,
    null
  );
  let ftime = shift_time.msg[0].f_time;
  let ttime = shift_time.msg[0].t_time;

 if(data.pay_mode == 'A'){
  var select = `b.device_id mc_srl_no_out, d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) paid_amt, SUM(c.advance_amt) advance_amt, SUM(c.base_amt) base_amt, c.pay_mode,SUM(c.cgst) cgst,SUM(c.sgst) sgst, f.operator_name opratorName`,
    table_name =
      "td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f",
    whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.car_out_flag = 'Y' AND DATE(b.date_time_out) BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND TIME(b.date_time_out) BETWEEN '${ftime}' AND '${ttime}' AND a.customer_id = '${custId}'`,
    order = "GROUP BY a.user_id_in,c.pay_mode";
  var res_dt = await db_Select(select, table_name, whr, order);
  res.send(res_dt);
  }else {
    var select = `b.device_id mc_srl_no_out, d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) paid_amt, SUM(c.advance_amt) advance_amt, SUM(c.base_amt) base_amt, c.pay_mode,SUM(c.cgst) cgst,SUM(c.sgst) sgst, f.operator_name opratorName`,
    table_name =
      "td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f",
    whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.car_out_flag = 'Y' AND DATE(b.date_time_out) BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND TIME(b.date_time_out) BETWEEN '${ftime}' AND '${ttime}' AND a.customer_id = '${custId}' AND c.pay_mode = '${data.pay_mode}'`,
    order = "GROUP BY a.user_id_in";
  var res_dt = await db_Select(select, table_name, whr, order);
  res.send(res_dt);
  }
});

module.exports = { reportRouter };
