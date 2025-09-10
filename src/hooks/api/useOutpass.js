import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";
import HourlyPriceCalculate from "../useHourlyPriceCalculate";

function useOutpass() {
    // console.log('Entered into useOutpass 1');
    const calculateTotalPrice = async (daywise, timestamp,vehicle_id,date_time_in,vehicle_no, grace_period, end_time,inTimestamp) => {
        // get Vehicle Rates By Id From Local Storage
        // const result = await getVehicleRatesByVehicleId(vehicleId);
        
        
        const result = await getVehicleRatesByVehicleId(vehicle_id, daywise);
        console.log(result?.rates?.msg[0]?.rate_type , 'resultresultresultresult', result?.rates?.msg);
        
        if (result?.rates?.msg[0]?.rate_type == 'F') {
            const price = HourlyPriceCalculate(result?.rates?.msg, date_time_in, end_time, daywise, result?.night_rates?.msg.length > 0 ? result?.night_rates?.msg[0] : 0 );

            // console.log(price, 'pricepricepriceprice');
            
            return price;
        }

        }



    const getVehicleRatesByVehicleId = async(vehicleId, daywise) => {
        console.log(vehicleId, 'getVehicleRatesByVehicleId', 'jjj', daywise);
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
            axios.post(ADDRESSES.OUTPASS_RATE_DETAILS_LIST,
                {
                    vehicle_id: vehicleId,
                    day_wise_rate: daywise
                },
                {
                    // headers: {
                    //     Authorization: loginData.token,
                    // },

                headers: {
                "x-access-token": loginData.token, // if API requires this
                // "Authorization": `Bearer ${loginData.token}`, // Bearer format
                // "Content-Type": "application/json",
                },

                },).then(res => {
                    // resolve(res.data.data.msg);
                    console.log('getVehicleRatesByVehicleId>>>>', res?.data?.data?.rates?.msg, 'getVehicleRatesByVehicleId');
                    
                    resolve(res?.data?.data);
                }).catch(err => {
                    console.log(err, 'errorerrorerrorerror');
                    reject(err);
                });
        });
    }

    
    

    const useCarOutpass=async(device_id, date_time_out, receipt_no, base_amt, cgst, sgst, paid_amt, gst_flag, vehicle_id, vehicle_no, date_time_in, getPayMode)=>{
        // console.log('Entered into useOutpass 2');
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
                    console.log(res.data, 'successsuccesssuccesssuccess');
                    resolve(res.data);
                }).catch(err => {
                    console.log(err, 'errorerrorerrorerror');
                    console.log(err);
                    reject(err);
                });
        });

    }



    return { calculateTotalPrice,useCarOutpass };
}

export default useOutpass;
