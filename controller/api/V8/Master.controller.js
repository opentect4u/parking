const Joi = require("joi");
const { db_Select } = require("../../../model/Master.model");
const { sendErrorResponce, sendOkResponce } = require("../../../utils/ResponceAssets");

const general_settings = async (req, res) => {
    try {
        const schema = Joi.object({
            //customer_id: Joi.string().required()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(null, errors));
        }
        const userData = req.user;
        let where = `customer_id=${userData.customer_id} AND app_id='${userData.device_id}'`
        var data = await db_Select('*', 'md_setting', where, null)
        res.json(sendOkResponce(data, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}




// const receipt_setting = async (req, res) => {
//     try {
//         const schema = Joi.object({
//             //key: Joi.string().required()
//         });
//         const { error, value } = schema.validate(req.body, { abortEarly: false });
//         if (error) {
//             const errors = {};
//             error.details.forEach(detail => {
//                 errors[detail.context.key] = detail.message;
//             });
//             return res.json(sendErrorResponce(null, errors));
//         }
//         const userData = req.user;
//         let where = `customer_id=${userData.customer_id}`
//         var data = await db_Select('*', 'md_receipt_setting', where, null)
//         res.json(sendOkResponce(data, null));
//     } catch (error) {
//         res.json(sendErrorResponce(error));
//     }
// }

// const receipt_setting = async (req, res) => {
//     try {
//         const schema = Joi.object({
//             //key: Joi.string().required()
//         });
//         const { error, value } = schema.validate(req.body, { abortEarly: false });
//         if (error) {
//             const errors = {};
//             error.details.forEach(detail => {
//                 errors[detail.context.key] = detail.message;
//             });
//             return res.json(sendErrorResponce(null, errors));
//         }
//         const userData = req.user;
//         let where = `a.customer_id=${userData.customer_id}`
//         var data = await db_Select('a.*,b.shift_name,b.f_time,b.t_time', 'md_receipt_setting a LEFT JOIN md_shift b ON a.customer_id = b.customer_id', where, null)
//         res.json(sendOkResponce(data, null));
//     } catch (error) {
//         res.json(sendErrorResponce(error));
//     }
// }

// const receipt_setting = async (req, res) => {
//   try {
//     const schema = Joi.object({});
//     const { error } = schema.validate(req.body, { abortEarly: false });

//     if (error) {
//       const errors = {};
//       error.details.forEach(detail => {
//         errors[detail.context.key] = detail.message;
//       });
//       return res.json(sendErrorResponce(null, errors));
//     }

//     const userData = req.user;
//     let where = `customer_id=${userData.customer_id}`;

//     // Fetch receipt setting (single row usually)
//     const receiptData = await db_Select('*', 'md_receipt_setting', where, null);

//     // Fetch shifts (multiple rows)
//     const shiftData = await db_Select(
//       'shift_name,f_time,t_time',
//       'md_shift',
//       where,
//       null
//     );

//     res.json(
//       sendOkResponce(
//         {
//         //   receipt_setting: receiptData && receiptData.msg.length ? receiptData.msg[0] : null,
//           receipt_setting: receiptData,
//           shifts: shiftData || [],
//         },
//         null
//       )
//     );
//   } catch (error) {
//     res.json(sendErrorResponce(error));
//   }
// };


const receipt_setting = async (req, res) => {
  try {
    const schema = Joi.object({});
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = {};
      error.details.forEach(detail => {
        errors[detail.context.key] = detail.message;
      });
      return res.json(sendErrorResponce(null, errors));
    }

    const userData = req.user;
    let where = `customer_id=${userData.customer_id}`;

    // Fetch receipt setting
    const receiptData = await db_Select('*', 'md_receipt_setting', where, null);

    // Fetch shifts
    const shiftData = await db_Select(
      'shift_name,f_time,t_time',
      'md_shift',
      where,
      null
    );

    if (receiptData.suc && receiptData.msg.length > 0) {
      // Add shifts under msg[0]
      receiptData.msg[0].shifts = shiftData.msg || [];
    }

    res.json(sendOkResponce(receiptData, null));
  } catch (error) {
    res.json(sendErrorResponce(error));
  }
};




const rate_dtls_list = async (req, res) => {
    try {
        const schema = Joi.object({
            dev_mod: Joi.string().valid('D', 'R', 'B', 'F', 'A').required()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(null, errors));
        }
        const userData = req.user;
        let where = `customer_id=${userData.customer_id}`;
        // let where=`customer_id=${userData.customer_id} AND rate_type='${value.dev_mod}'`;
        var data = await db_Select('*', 'md_rate_dtls', where, null)
        res.json(sendOkResponce(data, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}



// const fixed_rate_dtls_list = async (req, res) => {
//     try {
//         const schema = Joi.object({
//             // dev_mod: Joi.string().valid('D', 'R', 'B', 'F', 'A').required(),
//             vehicle_id: Joi.number().required()
//         });
//         const { error, value } = schema.validate(req.body, { abortEarly: false });
//         if (error) {
//             const errors = {};
//             error.details.forEach(detail => {
//                 errors[detail.context.key] = detail.message;
//             });
//             return res.json(sendErrorResponce(null, errors));
//         }
//         const userData = req.user;
//         let where = `customer_id=${userData.customer_id} AND vehicle_id=${value.vehicle_id}`,
//         order=`ORDER BY from_hour`;
//         // let where=`customer_id=${userData.customer_id} AND rate_type='${value.dev_mod}' AND vehicle_id=${value.vehicle_id}`;
//         var data = await db_Select('*', 'md_rate_dtls', where, order)
//         res.json(sendOkResponce(data, null));
//     } catch (error) {
//         res.json(sendErrorResponce(error));
//     }
// }

const fixed_rate_dtls_list_old = async (req, res) => {
    try {
        const schema = Joi.object({
            vehicle_id: Joi.number().required(),
            day_wise_rate: Joi.string().valid('Y', 'N').required(),
        });

        const { error, value } = schema.validate(req.body, { abortEarly: false });
        console.log(value,'values');
        
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(null, errors));
        }

        const userData = req.user;

        let select = "a.*, b.day_wise_rate";
        let table_name = `md_rate_dtls a
            LEFT JOIN (
                SELECT customer_id, day_wise_rate 
                FROM md_setting 
                WHERE customer_id = ${userData.customer_id}
                LIMIT 1
            ) b ON a.customer_id = b.customer_id`;

        const baseWhere = `a.vehicle_id = ${value.vehicle_id} AND a.customer_id = ${userData.customer_id}`;
        const order = `ORDER BY from_hour`;

        let result;

        if (value.day_wise_rate === 'Y') {
            // Fetch both day and night rate details
            const dayWhere = `${baseWhere} AND a.night_day_flag = 'O'`;
            const nightWhere = `${baseWhere} AND a.night_day_flag = 'N'`;

            const [dayRates, nightRates] = await Promise.all([
                db_Select(select, table_name, dayWhere, order),
                db_Select(select, table_name, nightWhere, order)
            ]);

            result = {
                rates: dayRates,
                night_rates: nightRates
            };
        } else {
            // Fetch only regular rate details (night_day_flag = 'O')
            const where = `${baseWhere} AND a.night_day_flag = 'O'`;
            const data_rate = await db_Select(select, table_name, where, order);
            result = {
                rates: data_rate,
                night_rates: {msg: []}
            };
        }

        res.json(sendOkResponce(result, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
};


// for fixed
const fixed_rate_dtls_list = async (req, res) => {
    try {
        const schema = Joi.object({
            // dev_mod: Joi.string().valid('D', 'R', 'B', 'F', 'A').required(),
            vehicle_id: Joi.number().required()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(null, errors));
        }
        const userData = req.user;
        let where = `customer_id=${userData.customer_id} AND vehicle_id=${value.vehicle_id}`,
        order=`ORDER BY from_hour`;
        // let where=`customer_id=${userData.customer_id} AND rate_type='${value.dev_mod}' AND vehicle_id=${value.vehicle_id}`;
        var data = await db_Select('*', 'md_rate_dtls', where, order)
        res.json(sendOkResponce(data, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}


// const gst_list = async (req, res) => {
//     try {
//         const schema = Joi.object({
//             //dev_mod: Joi.string().required()
//         });
//         const { error, value } = schema.validate(req.body, { abortEarly: false });
//         if (error) {
//             const errors = {};
//             error.details.forEach(detail => {
//                 errors[detail.context.key] = detail.message;
//             });
//             return res.json(sendErrorResponce(null, errors));
//         }
//         const userData = req.user;
//         // let where=`customer_id=${userData.customer_id} AND gst_flag='Y'`;
//         let where = `customer_id=${userData.customer_id}`;
//         var data = await db_Select('*', 'md_gst', where, null)
//         res.json(sendOkResponce(data, null));
//     } catch (error) {
//         res.json(sendErrorResponce(error));
//     }
// } amit

//sayantika 26.11.2024

const gst_list = async (req, res) => {
    try {
        const schema = Joi.object({
            //dev_mod: Joi.string().required()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(null, errors));
        }
        const userData = req.user;
        console.log(userData,'userdata');
        
        // let where=`customer_id=${userData.customer_id} AND gst_flag='Y'`;
        let where = `customer_id=${userData.customer_id} AND gst_flag='Y'`;
        var data = await db_Select('gst_number,cgst,sgst,other_charges', 'md_gst', where, null)
        // console.log(data,'ju');
        
        data.suc > 0 ? data.msg.length > 0 ? data.msg.filter(dt => { 
            dt['cgst'] = +dt['cgst']; 
            dt['sgst'] = +dt['sgst'];
            dt['other_charges'] = +dt['other_charges'];
        }) : '' : ''
        res.json(sendOkResponce(data, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}


const my_shift = async (req, res) => {
    try {
        custId = req.user.customer_id;
        shiftData = await db_Select('shift_id, shift_name', 'md_shift', `customer_id=${custId}`, 'ORDER BY f_time')
        res.json(sendOkResponce(shiftData, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}
module.exports = { general_settings, receipt_setting, rate_dtls_list, fixed_rate_dtls_list, gst_list, my_shift, fixed_rate_dtls_list_old }