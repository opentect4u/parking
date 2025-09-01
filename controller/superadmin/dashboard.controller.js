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
    const customer = await getAllcustomerlist(); // might be { msg: [...] }

    // Group customers by location
    const customersByLocation = {};
    (customer.msg || []).forEach(cust => {
      if (!customersByLocation[cust.location_id]) {
        customersByLocation[cust.location_id] = [];
      }
      customersByLocation[cust.location_id].push(cust);
    });

    const page_data = {
      title: "Dashboard details",
      page_path: "/super_admin/dashboard/dashboard",
      data: loca,
      customer_data: customer,
      customersByLocation: customersByLocation
    };
    console.log(page_data);
    

    res.render("common/layouts/main", page_data);
  } catch (err) {
    console.error(err);
    logger.error(err);
    res.redirect("/superadmin_login");
  }
};


module.exports = {dashboard_data}