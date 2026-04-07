import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function useCarIn() {
    const carIn = async (vehicleId,vehicleNo, baseAmt, paidAmt, gstFlag, cgst, sgst, igst) => {
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
             axios.post(
                    ADDRESSES.CAR_IN,
                    {
                        vehicle_id: vehicleId,
                        vehicle_no: vehicleNo,
                        base_amt: baseAmt,
                        // date_time: currentTime,
                        // adv_amt: adv_amt, Advance Amount
                        paid_amt: paidAmt,
                        gst_flag: gstFlag,
                        cgst: cgst,
                        sgst: sgst,
                        igst: igst
                    },
                    {
                        headers: {
                            Authorization: loginData.token,
                        },
                    },
                )
                .then(res => {
                    console.log("useCarIn___", res.data, 'then', 'res - carIn');
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("useCarIn___", err, 'error', 'res - carIn');
                    reject(err);
                });
        });
    };


    return { carIn };
}

export default useCarIn;
