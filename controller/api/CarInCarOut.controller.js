const Joi = require("joi");
const dateFormat = require('dateformat');
const { sendOkResponce, sendErrorResponce } = require("../../utils/ResponceAssets");
const { db_Select } = require("../../model/Master.model");
const { vehicle_in, insert_receipt, insert_vehicle_outpass, update_car_in_flag, insert_advance_receipt_update, outpass_advance_receipt_update } = require("../../module/car_in_out_receipt");


const car_in = async (req, res) => {
    try {

        
        const schema = Joi.object({
            vehicle_id: Joi.required(),
            vehicle_no: Joi.string().required(),
            base_amt: Joi.required(),
            cgst: Joi.required(),
            sgst: Joi.required(),
            paid_amt: Joi.required(),
            gst_flag: Joi.string().valid('Y', 'N').required(),
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


        let device_id = userData.device_id;
        let customer_id = userData.customer_id;
        let user_id = userData.id;
        let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
        let where = `customer_id=${customer_id} AND app_id='${device_id}'`
        const md_setting = await db_Select('*', 'md_setting', where, null)
        // console.log(md_setting)
        if ((md_setting.msg).length != 0) {
            let md_setting_data = md_setting.msg[0];
            let receipt_number = 1;
            if (md_setting_data.dev_mod == 'D' || md_setting_data.dev_mod == 'R') {
                let td_vehicle_in = await vehicle_in(userData, value.vehicle_id, value.vehicle_no, md_setting_data.dev_mod, md_setting_data.parking_entry_type)

                // console.log(td_vehicle_in.receipt_number,"***********");
            if (md_setting_data.adv_pay == 'Y') {
                let receipt = await insert_advance_receipt_update(userData, td_vehicle_in.receipt_number, 0, value.base_amt, value.cgst, value.sgst, value.paid_amt, value.gst_flag, 'A')
            }    

                if (td_vehicle_in.td_vehicle_in.suc == 1) {
                    res.json(sendOkResponce({ td_vehicle_in, receipt_number }, null));
                } else {
                    res.json(sendErrorResponce(null, { message: td_vehicle_in, }));
                }
            }
        } else {
            return res.json(sendErrorResponce(null, { message: 'Please set general setting' }));
        }


    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}



const car_in_fixed = async (req, res) => {
    try {
        console.log("fixed Mode")
        const schema = Joi.object({
            vehicle_id: Joi.required(),
            vehicle_no: Joi.string().required(),
            base_amt: Joi.required(),
            cgst: Joi.required(),
            sgst: Joi.required(),
            paid_amt: Joi.required(),
            gst_flag: Joi.string().valid('Y', 'N').required(),
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
        let device_id = userData.device_id;
        let customer_id = userData.customer_id;
        let user_id = userData.id;
        let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
        let where = `customer_id=${customer_id} AND app_id='${device_id}'`
        const md_setting = await db_Select('*', 'md_setting', where, null)
        // console.log(md_setting)
        if ((md_setting.msg).length != 0) {
            let md_setting_data = md_setting.msg[0];
            let receipt_number = 1;
            if (md_setting_data.dev_mod == 'F') {
                let td_vehicle_in = await vehicle_in(userData, value.vehicle_id, value.vehicle_no, md_setting_data.dev_mod, md_setting_data.parking_entry_type)
                console.log(td_vehicle_in)
                if (td_vehicle_in.td_vehicle_in.suc == 1) {
                    let receipt_insert = await insert_receipt(userData, td_vehicle_in.receipt_number, value.base_amt, value.cgst, value.sgst, value.paid_amt, value.gst_flag, 'P')
                    if (receipt_insert.suc == 1) {
                        let vehicle_outpass = await insert_vehicle_outpass(userData, device_id, datetime, td_vehicle_in.receipt_number);
                        if (vehicle_outpass.suc == 1) {
                           await update_car_in_flag(userData, value.vehicle_id, value.vehicle_no,td_vehicle_in.receipt_number)
                            res.json(sendOkResponce({ td_vehicle_in, receipt_insert, td_vehicle_in, receipt_number: td_vehicle_in.receipt_number, vehicle_outpass: vehicle_outpass }, null));
                        } else {
                            res.json(sendErrorResponce(null, { message: 'Not insert outpass' }));
                        }

                    } else {
                        res.json(sendErrorResponce(null, { message: 'Not Inserted' }));
                    }
                } else {
                    res.json(sendErrorResponce(null, { message: 'Not Inserted' }));
                }
            }
        } else {
            return res.json(sendErrorResponce(null, { message: 'Please set general setting' }));
        }
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}

const search_car = async (req, res) => {
    const schema = Joi.object({
        vehicle_number: Joi.required()
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {vehicle_number
        const errors = {};
        error.details.forEach(detail => {
            errors[detail.context.key] = detail.message;
        });
        return res.json(sendErrorResponce(null, errors));
    }
    const userData = req.user;
    // console.log(userData);
    let dev_mod = userData.dev_mod;

    if (dev_mod == 'D' || dev_mod == 'B') {
        // let where = `a.vehicle_id = b.vehicle_id AND a.customer_id = b.customer_id AND a.customer_id=${userData.customer_id} AND a.car_out_flag='N' AND a.vehicle_no LIKE '%${value.vehicle_number}%'`
        let where = `a.vehicle_id = b.vehicle_id AND a.customer_id = b.customer_id AND a.customer_id=${userData.customer_id} AND a.car_out_flag='N' AND (a.vehicle_no LIKE '%${value.vehicle_number}%' OR a.receipt_no LIKE '%${value.vehicle_number}')`
        let search_car = await db_Select('a.*,b.vehicle_name', 'td_vehicle_in a, md_vehicle b', where, null)
         console.log(search_car);
        res.json(sendOkResponce(search_car, null));
    } else {
        res.json(sendErrorResponce("Car not Found", null));
    }
}


const car_advance_amount = async (req, res) => {
    const schema = Joi.object({
        receipt_no: Joi.required()
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {receipt_no
        const errors = {};
        error.details.forEach(detail => {
            errors[detail.context.key] = detail.message;
        });
        return res.json(sendErrorResponce(null, errors));
    }
    const userData = req.user;
    console.log(userData);
    let adv_pay = userData.adv_pay;

    // console.log("/////////////////",adv_pay);
//   var custId = req.session.user.user_data.customer_id;


    if (adv_pay == 'Y') {
        let where = `a.receipt_no = b.receipt_no
        AND a.receipt_no = '${value.receipt_no}'
        AND b.customer_id = ${userData.customer_id}`
        let outpass_car = await db_Select('a.*,b.*', 'td_receipt a, td_vehicle_in b', where, null)
         console.log(outpass_car);
        res.json(sendOkResponce(outpass_car, null));
    } else {
        res.json(sendErrorResponce("Car not Found", null));
    }
}



const out_pass = async (req, res) => {

    const schema = Joi.object({
        device_id: Joi.required(),
        date_time_out: Joi.required(),
        receipt_no: Joi.required(),

        base_amt: Joi.required(),
        cgst: Joi.optional(),
        sgst: Joi.optional(),
        paid_amt: Joi.required(),
        gst_flag: Joi.optional(),

        vehicle_id: Joi.required(),
        vehicle_no: Joi.required(),
        date_time_in: Joi.required(),

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
    console.log(userData);
    let adv_pay = userData.adv_pay;


    let date_time_out = dateFormat(value.date_time_out, "yyyy-mm-dd HH:MM:ss")



    let where = `customer_id=${userData.customer_id} AND car_out_flag='N' AND vehicle_no LIKE '%${value.vehicle_no}%'`
    let search_car = await db_Select('*', 'td_vehicle_in', where, null)

    if (search_car.msg.length == 0) {
        return res.json(sendErrorResponce(null, { message: 'Car not Found' }));
    } else {



        let vehicle_outpass = await insert_vehicle_outpass(userData, value.device_id, date_time_out, value.receipt_no);

        if (vehicle_outpass.suc == 1) {
             if(adv_pay == 'Y'){
                var receipt = await outpass_advance_receipt_update(userData, value.receipt_no, value.base_amt, value.cgst, value.sgst, value.paid_amt, value.gst_flag, 'A')
             }else {
                var receipt = await insert_receipt(userData, value.receipt_no, value.base_amt, value.cgst, value.sgst, value.paid_amt, value.gst_flag, 'P')

             }


            if (receipt.suc == 1) {
                let update_car_in_flag_status = await update_car_in_flag(userData, value.vehicle_id, value.vehicle_no, value.receipt_no)
                console.log(update_car_in_flag_status)
                res.json(sendOkResponce({ update_car_in_flag_status }, null));
            } else {
                res.json(sendErrorResponce(null, { message: receipt }));
            }
        } else {
            res.json(sendErrorResponce(null, { message: vehicle_outpass }));
        }

    }

}


module.exports = { car_in, search_car, out_pass, car_in_fixed, car_advance_amount };