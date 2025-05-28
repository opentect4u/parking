import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";
import HourlyPriceCalculate from "../useHourlyPriceCalculate";

function useOutpass() {
    const calculateTotalPrice = async (daywise, timestamp,vehicle_id,date_time_in,vehicle_no, grace_period, end_time,inTimestamp) => {
        // get Vehicle Rates By Id From Local Storage
        // const result = await getVehicleRatesByVehicleId(vehicleId);
        
        
        const result = await getVehicleRatesByVehicleId(vehicle_id, daywise);
        // console.log(daywise, 'urrrrrrrrrrrrrrrrrrrrrrrrr', vehicle_id, 'urrrrrrrrrrrrrrrrrrrrrrrrr' , result, 'urrrrrrrrrrrrrrrrrrrrrrrrr');
        // console.log("UTSABBBB__", result[0]?.rate_type == 'H');
        // console.log(result[0], 'resultresultresultresultresultresultresult');
        if (result?.rates?.msg[0]?.rate_type == 'H') {
            // If Rate type is H, H For Hourly
            // const price = HourlyPriceCalculate( result, date_time_in, end_time, grace_period); res?.data?.data?.night_rates?.msg.length
            const price = HourlyPriceCalculate(result?.rates?.msg, date_time_in, end_time, daywise, result?.night_rates?.msg.length > 0 ? result?.night_rates?.msg[0] : 0 );
            
            console.log('uuuurrrrrrrrrrr', price, 'uuuurrrrrrrrrrr');

            return price;
        }

    }



    const getVehicleRatesByVehicleId = async(vehicleId, daywise) => {
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
            axios.post(ADDRESSES.FIXED_RATE_DETAILS_LIST,
                {
                    vehicle_id: vehicleId,
                    day_wise_rate: daywise
                },
                {
                    headers: {
                        Authorization: loginData.token,
                    },
                },).then(res => {
                    // resolve(res.data.data.msg);
                    resolve(res?.data?.data);
                    // console.log('ooooooooo', res?.data?.data?.night_rates?.msg.length, 'oooooooooo', res?.data?.data?.rates?.msg[0]?.rate_type , 'ooooooooooooooooooo', res?.data?.data?.night_rates?.msg);
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    
    

    const useCarOutpass=async(device_id, date_time_out, receipt_no, base_amt, cgst, sgst, paid_amt, gst_flag, vehicle_id, vehicle_no, date_time_in, getPayMode)=>{

        // console.log(device_id, '//', date_time_out, '//', receipt_no, '// base amount', base_amt, '//', cgst, '//', sgst, '//', paid_amt, '//', gst_flag, '//', vehicle_id, '//', vehicle_no, '//', date_time_in, '//', getPayMode, 'uyyyyyyyyyy');

        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
            axios.post(ADDRESSES.CAR_OUT,
                {
                    device_id:device_id,
                    date_time_out:date_time_out,
                    receipt_no:receipt_no,
                    base_amt:base_amt,
                    // cgst:cgst?cgst:0,
                    // sgst:sgst?sgst:0,
                    cgst:cgst,
                    sgst:sgst,
                    paid_amt:paid_amt,
                    // gst_flag:gst_flag?gst_flag:"N",
                    gst_flag:gst_flag,
                    vehicle_id:vehicle_id,
                    vehicle_no:vehicle_no,
                    date_time_in:date_time_in,
                    paymode:getPayMode
                },
                {
                    headers: {
                        Authorization: loginData.token,
                    },
                },).then(res => {
                    console.log("useCarOutpass",res.data, 'hhhhhhhhhhhhhh')
                    resolve(res.data);
                }).catch(err => {
                    console.log(err);
                    console.log("useCarOutpass",err, 'hhhhhhhhhhhhhh')
                    reject(err);
                });
        });

    }



    return { calculateTotalPrice,useCarOutpass };
}

export default useOutpass;
