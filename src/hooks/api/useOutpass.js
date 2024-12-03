import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";
import HourlyPriceCalculate from "../useHourlyPriceCalculate";

function useOutpass() {
    const calculateTotalPrice = async (timestamp,vehicle_id,date_time_in,vehicle_no, grace_period, end_time,inTimestamp) => {
        // get Vehicle Rates By Id From Local Storage
        // const result = await getVehicleRatesByVehicleId(vehicleId);
        const result = await getVehicleRatesByVehicleId(vehicle_id);
        // console.log("UTSABBBB__", date_time_in);
        console.log(result[0], 'result[0]result[0]result[0]');
        if (result[0]?.rate_type == 'H') {
            // If Rate type is H, H For Hourly
            // const price = HourlyPriceCalculate( result, date_time_in, end_time, grace_period);
            const price = HourlyPriceCalculate( result, date_time_in, end_time);

            return price;
        }

        // if (result[0].rate_type == 'T') {
        //     // If Rate type is T, T For Timely
        //     const testStrtT = new Date(start_time);
        //     const testEndT = new Date(end_time);

        //     // console.log(result);
        //     // console.log(testStrtT.toLocaleString(), '--', testEndT.toLocaleString());

        //     const { price } = DayTimePriceCalculate(start_time, end_time, result);
        //     return price;
        // }
    }



    const getVehicleRatesByVehicleId = async(vehicleId) => {
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
            axios.post(ADDRESSES.FIXED_RATE_DETAILS_LIST,
                {
                    vehicle_id: vehicleId
                },
                {
                    headers: {
                        Authorization: loginData.token,
                    },
                },).then(res => {
                    resolve(res.data.data.msg);
                    console.log(res.data.data.msg, 'ooooooooooooooooooooooooooooooooooooooo');
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }


    const useCarOutpass=async(device_id, date_time_out, receipt_no, base_amt, cgst, sgst, paid_amt, gst_flag, vehicle_id, vehicle_no, date_time_in, getPayMode)=>{
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        // console.log("useCarOutpass",{
        //     device_id:device_id,
        //     date_time_out:date_time_out,
        //     receipt_no:receipt_no,
        //     base_amt:base_amt,
        //     // cgst:cgst?cgst:0,
        //     // sgst:sgst?sgst:0,
        //     cgst:cgst,
        //     sgst:sgst,
        //     paid_amt:paid_amt,
        //     // gst_flag:gst_flag?gst_flag:"N",
        //     gst_flag:gst_flag,
        //     vehicle_id:vehicle_id,
        //     vehicle_no:vehicle_no,
        //     date_time_in:date_time_in,
        //     paymode:getPayMode
        // })
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
                    console.log("useCarOutpass",res.data)
                    resolve(res.data);
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
        });

    }



    return { calculateTotalPrice,useCarOutpass };
}

export default useOutpass;
