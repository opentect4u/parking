import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";
import HourlyPriceCalculate from "../useHourlyPriceCalculate";

function useOutpass() {
    const calculateTotalPrice = async (daywise, timestamp,vehicle_id,date_time_in,vehicle_no, grace_period, end_time,inTimestamp) => {
        // get Vehicle Rates By Id From Local Storage
        // const result = await getVehicleRatesByVehicleId(vehicleId);
        
        
        const result = await getVehicleRatesByVehicleId(vehicle_id, daywise);
        

        // This i use for Flag that is it New Rate or Custome Rate.
        var rateFlag = result?.night_rates?.msg.length > 0 ? 'newRate' : 'customeRate';

        // console.log('price___START', result?.rates?.msg, 'price___END', result?.night_rates?.msg, 'price___END', result?.custom_rates?.msg[0], 'kkkkkk', rateFlag);

        if (result?.rates?.msg[0]?.rate_type == 'H') {
            // console.log(result?.rates?.msg, date_time_in, end_time, daywise, result?.night_rates?.msg.length > 0 ? result?.night_rates?.msg[0] : 0, 'pricepricepriceprice__________________');
            const price = HourlyPriceCalculate(result?.rates?.msg, date_time_in, end_time, daywise, 
                result?.night_rates?.msg.length > 0 ? result?.night_rates?.msg[0] : result?.custom_rates?.msg.length > 0 ? result?.custom_rates?.msg[0] : 0, rateFlag );
            
            // console.log(price, 'pricepricepriceprice__________________');
            
            
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
                    console.log('getVehicleRatesByVehicleId>>>>', res?.data?.data, 'getVehicleRatesByVehicleId');
                    resolve(res?.data?.data);
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    
    

    const useCarOutpass=async(device_id, date_time_out, receipt_no, base_amt, cgst, sgst, igst, paid_amt, gst_flag, vehicle_id, vehicle_no, date_time_in, getPayMode)=>{

        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
            axios.post(ADDRESSES.CAR_OUT,
                {
                    device_id:device_id,
                    date_time_out:date_time_out,
                    receipt_no:receipt_no,
                    base_amt:base_amt,
                    cgst:cgst,
                    sgst:sgst,
                    igst:igst,
                    paid_amt:paid_amt,
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
                    console.log(res.data, 'useCarOutpass', 'response');
                    
                    resolve(res.data);
                }).catch(err => {
                    console.log(err, 'useCarOutpass', 'error');
                    console.log(err);
                    reject(err);
                });
        });

    }



    return { calculateTotalPrice,useCarOutpass };
}

export default useOutpass;
