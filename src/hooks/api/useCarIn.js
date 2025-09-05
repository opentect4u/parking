import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function useCarIn() {
    // const carIn = async (vehicleId,vehicleNo, baseAmt, paidAmt, gstFlag, cgst, sgst) => {
    const carIn = async (vehicleId,vehicleNo, baseAmt, paidAmt, gstFlag, cgst, sgst, CGST_Calculate, SGST_Calculate, other_charges, getPayMode) => {
        console.log( vehicleId,
                         vehicleNo,
                         baseAmt, 
                         paidAmt,
                         gstFlag,
                         cgst,
                         sgst,
                         CGST_Calculate,
                         SGST_Calculate,
                         other_charges,
                         getPayMode, 'baseAmt__UTSAB', CGST_Calculate, SGST_Calculate);

        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
             axios.post(
                    ADDRESSES.CAR_IN,
                    {
                        // vehicle_id: vehicleId,
                        // vehicle_no: vehicleNo,
                        // base_amt: baseAmt,
                        // paid_amt: paidAmt,
                        // gst_flag: gstFlag,
                        // cgst: cgst,
                        // sgst: sgst,

                        vehicle_id: vehicleId,
                        vehicle_no: vehicleNo,
                        base_amt: baseAmt, 
                        paid_amt: paidAmt,
                        gst_flag: gstFlag,
                        cgst: cgst,
                        sgst: sgst,
                        CGST_Calculate: CGST_Calculate,
                        SGST_Calculate: SGST_Calculate,
                        other_charges: other_charges,
                        paymode: getPayMode,
                    },
                    {
                        headers: {
                            Authorization: loginData.token,
                        },
                    },
                )
                .then(res => {
                    console.log("res - carIn - useCarIn___then", res.data, 'baseAmt__UTSAB');
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("res - carIn - useCarIn___catch", err, 'baseAmt__UTSAB');
                    reject(err);
                });
        });
    };


    return { carIn };
}

export default useCarIn;
