import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function usegetShiftwiseReport() {
    const shift_wise = async (fDate,tDate,shift_id) => {
        
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
            console.log(shift_id)
             axios.post(
                    ADDRESSES.SHIFTWISE_REPORT_DATA,
                    {
                        frm_dt: fDate,
                        to_dt: tDate,
                        shift_id:shift_id
                    },
                    {
                        headers: {
                            Authorization: loginData.token,
                        },
                    },
                )
                .then(res => {
                    console.log("res - operator_wise - usegetShiftwiseReport", res.data);
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("res - operator_wise - usegetShiftwiseReport", err);
                    reject(err);
                });
        });
    };


    return { shift_wise };
}

export default usegetShiftwiseReport;
