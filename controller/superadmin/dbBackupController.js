const { db_Select } = require("../../model/Master.model");

const db_bakup = async (req, res) => {
  try {
    const page_data = {
      title: "Database Backup",
      page_path: "/super_admin/db_backup/db_backup",
    };
    // console.log(page_data);
    res.render("common/layouts/main", page_data);
  } catch (err) {
    console.error(err);
    // logger.error(err);
    res.redirect("/superadmin_login");
  }
};

// const download_csv_backup = async (req, res) => {
//   try{
//    var data = req.body;
//    console.log(data,'dt');

//    if (!data.from_date || !data.to_date) {
//       return res.json({ suc: 0, msg: "From & To date required" });
//     }

//      // Fetch data
//     var select = "g.customer_name,a.receipt_no, DATE_FORMAT(a.date_time_in,'%d/%m/%Y %H:%i:%s') date_time_in, a.device_id, d.vehicle_name, a.vehicle_no,DATE_FORMAT(b.date_time_out,'%d/%m/%Y %H:%i:%s') date_time_out, b.device_id device_id_out, c.base_amt, c.advance_amt,c.cgst, c.sgst, c.paid_amt, c.other_charges, c.pay_mode, f.operator_name",
//     table_name = "td_vehicle_in a LEFT JOIN td_vehicle_out b ON a.receipt_no=b.receipt_no LEFT JOIN td_receipt c ON a.receipt_no=c.receipt_no LEFT JOIN md_vehicle d ON a.vehicle_id=d.vehicle_id LEFT JOIN md_user e ON a.user_id_in=e.id LEFT JOIN md_operator f ON e.user_id=f.user_id LEFT JOIN md_customer g On a.customer_id = g.customer_id",
//     whr = `a.car_out_flag='Y'
//       AND b.date_time_out BETWEEN '${data.from_date}' AND '${data.to_date}'`,
//     order = `ORDER BY a.receipt_no,a.customer_id`;
//     var csv_data = await db_Select(select,table_name,whr,order);

//     if (!csv_data.msg || csv_data.msg.length === 0) {
//       return res.json({ suc: 0, msg: "No data found" });
//     }

//      // 🔹 CSV Header
//     let csv = 
//     "Customer Name,Receipt No,Receipt No(short),Date Time In,Device ID In,Vehicle Name,Vehicle No,Date Time Out,Device ID Out,Base Amount,Advance Amount,CGST,SGST,MIS Charges,Net Amount,Mode,Operator Namee\n";

//     const csvSafe = (val) => {
//   if (val === null || val === undefined) return "";
//   return `"${String(val).replace(/"/g, '""')}"`;
// };

//      // CSV Rows
// csv_data.msg.forEach(row => {
//   csv +=
//     `${csvSafe(row.customer_name)},` +
//     `${csvSafe(row.receipt_no)},` +
//     `${csvSafe(row.receipt_no)},` +
//     `${csvSafe(row.date_time_in)},` +
//     `${csvSafe(row.device_id)},` +
//     `${csvSafe(row.vehicle_name)},` +
//     `${csvSafe(row.vehicle_no)},` +
//     `${csvSafe(row.date_time_out)},` +
//     `${csvSafe(row.device_id_out)},` +
//     `${csvSafe(row.base_amt)},` +
//     `${csvSafe(row.advance_amt)},` +
//     `${csvSafe(row.cgst)},` +
//     `${csvSafe(row.sgst)},` +
//     `${csvSafe(row.other_charges)},` +
//     `${csvSafe(row.paid_amt)},` +
//     `${csvSafe(row.pay_mode)},` +
//     `${csvSafe(row.operator_name)}\n`; // ✅ newline
// });

//     const fileName = `csv_backup_${dateFormat(new Date(), "yyyymmdd_HHMMss")}.csv`;

//      // 🔹 Set headers for download
//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

//     return res.send(csv);
   
//   } catch (err) {
//     console.error(err);
//     // logger.error(err);
//     res.redirect("/superadmin_login");
//   }
// }


// const download_csv_backup = async (req, res) => {
//   try{
//    var data = req.body;
//   //  console.log(data,'dt');

//    if (!data.from_date || !data.to_date) {
//       return res.json({ suc: 0, msg: "From & To date required" });
//     }

//      // SET HEADERS FIRST (VERY IMPORTANT)
//     const fileName = `csv_backup_${dateFormat(new Date(), "yyyymmdd_HHMMss")}.csv`;

//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
//     res.setHeader("Cache-Control", "no-store");

//     // Force headers to client immediately
//     res.flushHeaders();

//     // CSV Header
//     res.write(
//       "Customer Name,Receipt No,Receipt No(short),Date Time In,Device ID In,Vehicle Name,Vehicle No,Date Time Out,Device ID Out,Base Amount,Advance Amount,CGST,SGST,MIS Charges,Net Amount,Mode,Operator Name\n"
//     );

//      // Fetch data
//     var select = "g.customer_name,a.receipt_no, DATE_FORMAT(a.date_time_in,'%d/%m/%Y %H:%i:%s') date_time_in, a.device_id, d.vehicle_name, a.vehicle_no,DATE_FORMAT(b.date_time_out,'%d/%m/%Y %H:%i:%s') date_time_out, b.device_id device_id_out, c.base_amt, c.advance_amt,c.cgst, c.sgst, c.paid_amt, c.other_charges, c.pay_mode, f.operator_name",
//     table_name = "td_vehicle_in a LEFT JOIN td_vehicle_out b ON a.receipt_no=b.receipt_no LEFT JOIN td_receipt c ON a.receipt_no=c.receipt_no LEFT JOIN md_vehicle d ON a.vehicle_id=d.vehicle_id LEFT JOIN md_user e ON a.user_id_in=e.id LEFT JOIN md_operator f ON e.user_id=f.user_id LEFT JOIN md_customer g On a.customer_id = g.customer_id",
//     whr = `a.car_out_flag='Y'
//       AND b.date_time_out BETWEEN '${data.from_date}' AND '${data.to_date}'`,
//     order = `ORDER BY a.receipt_no,a.customer_id`;
//     var csv_data = await db_Select(select,table_name,whr,order);

//     if (!csv_data.msg || csv_data.msg.length === 0) {
//       res.write("\nNo data found");
//       return res.end();
//     }

//      const csvSafe = (val) =>
//       val === null || val === undefined ? "" : `"${String(val).replace(/"/g, '""')}"`;

//      const excelText = (val) =>
//       val === null || val === undefined ? "" : `="${String(val)}"`;


//      const num = (val) => Number(val || 0);
//      const fixed2 = (val) => num(val).toFixed(2);

//      let totalBase = 0;
//      let totalAdvance = 0;
//      let totalCgst = 0;
//      let totalSgst = 0;
//      let totalOtherCharges = 0;
//      let totalNet = 0;
//      let totalCash = 0;
//      let totalUpi = 0;


//      // STREAM ROWS ONE BY ONE
//      for (const row of csv_data.msg) {

//          const baseAmt = num(row.base_amt);
//          const advanceAmt = num(row.advance_amt);
//          const cgstAmt = num(row.cgst);
//          const sgstAmt = num(row.sgst);
//          const otherCharges = num(row.other_charges);
//          const paidAmt = num(row.paid_amt);
//          const netAmount = paidAmt + otherCharges;
           
//           // accumulate numbers
//          totalBase += baseAmt;
//          totalAdvance += advanceAmt;
//          totalCgst += cgstAmt;
//          totalSgst += sgstAmt;
//          totalOtherCharges += otherCharges;
//          totalNet += netAmount;

//          if (row.pay_mode === "C") {
//             totalCash += netAmount;
//          } else if (row.pay_mode === "U") {
//             totalUpi += netAmount;
//          }

//       res.write(
//     `${csvSafe(row.customer_name)},` +
//     `${excelText(row.receipt_no)},` +
//     `${excelText(String(row.receipt_no || "").slice(-5))},` +
//     `${csvSafe(row.date_time_in)},` +
//     `${excelText(row.device_id)},` +
//     `${csvSafe(row.vehicle_name)},` +
//     // `${excelText(row.vehicle_no)},` +
//     `${csvSafe(row.vehicle_no)},` +
//     `${csvSafe(row.date_time_out)},` +
//     `${excelText(row.device_id_out)},` +
//     `${fixed2(baseAmt)},` +
//     `${fixed2(advanceAmt)},` +
//     `${fixed2(cgstAmt)},` +
//     `${fixed2(sgstAmt)},` +
//     `${fixed2(otherCharges)},` +
//     `${fixed2(netAmount)},` +
//     `${csvSafe(row.pay_mode === "C" ? "CASH" : row.pay_mode === "U" ? "UPI" : "")},` +
//     `${csvSafe(row.operator_name)}\n`
//     );
//   }

//   res.write("\n");

// res.write(
//   `TOTAL,,,,,,,,,${csvSafe(fixed2(totalBase))},` +
//   `${csvSafe(fixed2(totalAdvance))},` +
//   `${csvSafe(fixed2(totalCgst))},` +
//   `${csvSafe(fixed2(totalSgst))},` +
//   `${csvSafe(fixed2(totalOtherCharges))},` +
//   `${csvSafe(fixed2(totalNet))},,,\n`
// );

//  res.write("\n");

// res.write(
//   `TOTAL CASH,${fixed2(totalCash)}\n`
// );

// res.write(
//   `TOTAL UPI,${fixed2(totalUpi)}\n`
// );
        
//  res.end();
   
//   } catch (err) {
//     console.error(err);
//     // logger.error(err);
//     res.redirect("/superadmin_login");
//   }
// }

const download_csv_backup = async (req, res) => {
  try{
   var data = req.body;
  //  console.log(data,'dt');

   if (!data.from_date || !data.to_date) {
      return res.json({ suc: 0, msg: "From & To date required" });
    }

     // SET HEADERS FIRST (VERY IMPORTANT)
    const fileName = `csv_backup_${dateFormat(new Date(), "yyyymmdd_HHMMss")}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Cache-Control", "no-store");

    // Force headers to client immediately
    res.flushHeaders();

    // CSV Header
    res.write(
      "Customer Name,Receipt No,Receipt No(short),Date Time In,Device ID In,Vehicle Name,Vehicle No,Date Time Out,Device ID Out,Base Amount,Advance Amount,CGST,SGST,MIS Charges,Net Amount,Mode,Operator Name\n"
    );

    //  const csvSafe = (val) =>
    //   val === null || val === undefined ? "" : `"${String(val).replace(/"/g, '""')}"`;

     const excelText = (val) =>
      val === null || val === undefined ? "" : `="${String(val)}"`;

      const csvSafe = (val) => {
      if (val === null || val === undefined) return '""';

      let str = String(val);

      if (/^[=+\-@]/.test(str)) {
        str = "'" + str;
      }

      // Escape quotes
      str = str.replace(/"/g, '""');

      return `"${str}"`;
    };


     const num = (val) => Number(val || 0);
     const fixed2 = (val) => num(val).toFixed(2);

     // Fetch data
    var select = "g.customer_name,a.receipt_no, DATE_FORMAT(a.date_time_in,'%d/%m/%Y %H:%i:%s') date_time_in, a.device_id, d.vehicle_name, a.vehicle_no,DATE_FORMAT(b.date_time_out,'%d/%m/%Y %H:%i:%s') date_time_out, b.device_id device_id_out, c.base_amt, c.advance_amt,c.cgst, c.sgst, c.paid_amt, c.other_charges, c.pay_mode, f.operator_name",
    table_name = "td_vehicle_in a LEFT JOIN td_vehicle_out b ON a.receipt_no=b.receipt_no LEFT JOIN td_receipt c ON a.receipt_no=c.receipt_no LEFT JOIN md_vehicle d ON a.vehicle_id=d.vehicle_id LEFT JOIN md_user e ON a.user_id_in=e.id LEFT JOIN md_operator f ON e.user_id=f.user_id LEFT JOIN md_customer g On a.customer_id = g.customer_id",
    whr = `a.car_out_flag='Y'
      AND b.date_time_out BETWEEN '${data.from_date}' AND '${data.to_date}'`,
    order = `ORDER BY a.receipt_no,a.customer_id`;
    var csv_data = await db_Select(select,table_name,whr,order);

    if (!csv_data.msg || csv_data.msg.length === 0) {
      res.write("\nNo data found");
      return res.end();
    }

     let totalBase = 0;
     let totalAdvance = 0;
     let totalCgst = 0;
     let totalSgst = 0;
     let totalOtherCharges = 0;
     let totalNet = 0;
     let totalCash = 0;
     let totalUpi = 0;


     // STREAM ROWS ONE BY ONE
     for (const row of csv_data.msg) {

         const baseAmt = num(row.base_amt);
         const advanceAmt = num(row.advance_amt);
         const cgstAmt = num(row.cgst);
         const sgstAmt = num(row.sgst);
         const otherCharges = num(row.other_charges);
         const paidAmt = num(row.paid_amt);
         const netAmount = paidAmt + otherCharges;
           
          // accumulate numbers
         totalBase += baseAmt;
         totalAdvance += advanceAmt;
         totalCgst += cgstAmt;
         totalSgst += sgstAmt;
         totalOtherCharges += otherCharges;
         totalNet += netAmount;

         if (row.pay_mode === "C") {
            totalCash += netAmount;
         } else if (row.pay_mode === "U") {
            totalUpi += netAmount;
         }

      res.write(
    `${csvSafe(row.customer_name)},` +
    `${excelText(row.receipt_no)},` +
    `${excelText(String(row.receipt_no || "").slice(-5))},` +
    `${csvSafe(row.date_time_in)},` +
    `${excelText(row.device_id)},` +
    `${csvSafe(row.vehicle_name)},` +
    // `${excelText(row.vehicle_no)},` +
    `${csvSafe(row.vehicle_no)},` +
    `${csvSafe(row.date_time_out)},` +
    `${excelText(row.device_id_out)},` +
    `${fixed2(baseAmt)},` +
    `${fixed2(advanceAmt)},` +
    `${fixed2(cgstAmt)},` +
    `${fixed2(sgstAmt)},` +
    `${fixed2(otherCharges)},` +
    `${fixed2(netAmount)},` +
    `${csvSafe(row.pay_mode === "C" ? "CASH" : row.pay_mode === "U" ? "UPI" : "")},` +
    `${csvSafe(row.operator_name)}\n`
    );
  }

  res.write("\n");

res.write(
  `TOTAL,,,,,,,,,${csvSafe(fixed2(totalBase))},` +
  `${csvSafe(fixed2(totalAdvance))},` +
  `${csvSafe(fixed2(totalCgst))},` +
  `${csvSafe(fixed2(totalSgst))},` +
  `${csvSafe(fixed2(totalOtherCharges))},` +
  `${csvSafe(fixed2(totalNet))},,,\n`
);

 res.write("\n");

res.write(
  `TOTAL CASH,${fixed2(totalCash)}\n`
);

res.write(
  `TOTAL UPI,${fixed2(totalUpi)}\n`
);
        
 res.end();
   
  } catch (err) {
    console.error(err);
    // logger.error(err);
    res.redirect("/superadmin_login");
  }
}


module.exports = {db_bakup, download_csv_backup}