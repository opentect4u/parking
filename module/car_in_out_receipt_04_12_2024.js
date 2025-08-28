const dateFormat = require('dateformat');
const { db_Insert } = require('../model/Master.model');

const vehicle_in = (userData, vehicle_id, vehicle_no, dev_mod, receipt_type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let receipt_number = new Date().getTime();
            let vehicle_in_fields = `(user_id_in, vehicle_id, customer_id, device_id, vehicle_no, date_time_in, oprn_mode, receipt_type, receipt_no, created_at)`;
            let vehicle_in_values = `(${userData.id}, ${vehicle_id}, ${userData.customer_id}, '${userData.device_id}', '${vehicle_no}', '${datetime}', '${dev_mod}', '${receipt_type}', ${receipt_number}, '${datetime}')`;


            let td_vehicle_in = await db_Insert("td_vehicle_in", vehicle_in_fields, vehicle_in_values, null, 0);
            let insertData = { td_vehicle_in, receipt_number }
            resolve(insertData);
        } catch (error) {
            reject(error);
        }
    });
}


const insert_receipt = (userData, receipt_no, base_amt, cgst, sgst, paid_amt, gst_flag, trans_flag) => {
    return new Promise(async (resolve, reject) => {
        try {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            let receipt_fields = `(receipt_no, user_id, base_amt, cgst, sgst, paid_amt, gst_flag, trans_flag, created_at)`,
                receipt_values = `(${receipt_no},${userData.id},${base_amt},${cgst}, ${sgst}, ${paid_amt}, '${gst_flag}', '${trans_flag}','${datetime}')`;
            var receipt = await db_Insert("td_receipt", receipt_fields, receipt_values, null, 0);
            resolve(receipt);
        } catch (error) {
            reject(error);
        }
    });
}

const insert_advance_receipt_update = (userData, receipt_no, base_amt, advance_amt, cgst, sgst, paid_amt, gst_flag, trans_flag) => {
    return new Promise(async (resolve, reject) => {
        try {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            let receipt_fields = `(receipt_no, user_id, base_amt, advance_amt, cgst, sgst, paid_amt, gst_flag, trans_flag, created_at)`,
                receipt_values = `(${receipt_no},${userData.id},${base_amt},${advance_amt},${cgst}, ${sgst}, ${paid_amt}, '${gst_flag}', '${trans_flag}','${datetime}')`;
            var receipt = await db_Insert("td_receipt", receipt_fields, receipt_values, null, 0);
            resolve(receipt);
        } catch (error) {
            reject(error);
        }
    });
}

const outpass_advance_receipt_update = (userData, receipt_no, base_amt, cgst, sgst, paid_amt, gst_flag, trans_flag) => {
    return new Promise(async (resolve, reject) => {
        try {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            let receipt_fields = `user_id=${userData.id}, base_amt=${base_amt}, cgst=${cgst}, sgst=${sgst}, paid_amt=${paid_amt}, gst_flag='${gst_flag}', trans_flag='${trans_flag}', updated_at='${datetime}'`,
                where = `receipt_no='${receipt_no}'`;
            var receipt_update = await db_Insert("td_receipt", receipt_fields, null, where, 1);
            resolve(receipt_update);
        } catch (error) {
            reject(error);
        }
    });  
}


const insert_vehicle_outpass = (userData, device_id, date_time_out, receipt_no) => {
    return new Promise(async (resolve, reject) => {
        try {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

            let fields = `(user_id, device_id, date_time_out, receipt_no, created_at, updated_at)`,
                values = `(${userData.id},'${device_id}','${date_time_out}', '${receipt_no}','${datetime}','${datetime}')`;
            var data = await db_Insert("td_vehicle_out", fields, values, null, 0);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}


const update_car_in_flag = (userData, vehicle_id, vehicle_no,receipt_no) => {
    return new Promise(async (resolve, reject) => {
        try {
            let values = `car_out_flag = "Y"`,
                whr = `vehicle_id = '${vehicle_id}' AND customer_id=${userData.customer_id} AND vehicle_no='${vehicle_no}' AND receipt_no='${receipt_no}' AND car_out_flag='N'`;
            var data = await db_Insert("td_vehicle_in", values, null, whr, 1);
            resolve(data);
        } catch (error) {
            
            reject(error);
        }
    });
}



module.exports = { vehicle_in, insert_receipt, insert_vehicle_outpass, update_car_in_flag,insert_advance_receipt_update, outpass_advance_receipt_update }