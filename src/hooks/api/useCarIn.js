import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function useCarIn() {
    const carIn = async (vehicleId,vehicleNo, baseAmt, paidAmt, gstFlag, cgst, sgst) => {
        
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
             axios.post(
                    ADDRESSES.CAR_IN,
                    {
                        vehicle_id: vehicleId,
                        vehicle_no: vehicleNo,
                        base_amt: baseAmt,
                        paid_amt: paidAmt,
                        gst_flag: gstFlag,
                        cgst: cgst,
                        sgst: sgst,
                    },
                    {
                        headers: {
                            Authorization: loginData.token,
                        },
                    },
                )
                .then(res => {
                    console.log("res - carIn - useCarIn", res.data);
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("res - carIn - useCarIn", err);
                    reject(err);
                });
        });
    };


    return { carIn };
}

export default useCarIn;
