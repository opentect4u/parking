import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function usegetShiftwiseReport() {
    const shift_wise = async (fDate,tDate,shift_id, getUserName) => {
        console.log(fDate,tDate,shift_id, getUserName, 'fDatetDateshift_idgetUserName')
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
            
             axios.post(
                    ADDRESSES.SHIFTWISE_REPORT_DATA,
                //     {
                //         "customer_id": "14",
                //         "frm_dt": "2024-12-02",
                //         "to_dt": "2024-12-02",
                //         "shift_id":"13"
                //    }
                    {
                        customer_id: getUserName,
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
