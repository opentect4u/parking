import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function usegetOperatorwiseReport() {
    const operator_wise = async (fDate,tDate, getUserName) => {
        
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
             axios.post(
                    ADDRESSES.OPERATOR_WISE_RERORT,
                    {
                        customerUserName: getUserName,
                        from_date: fDate,
                        to_date: tDate
                    },
                    {
                        headers: {
                            Authorization: loginData.token,
                        },
                    },
                )
                .then(res => {
                    console.log("res - operator_wise - usegetOperatorwiseReport", res.data);
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("res - operator_wise - usegetOperatorwiseReport", err);
                    reject(err);
                });
        });
    };


    return { operator_wise };
}

export default usegetOperatorwiseReport;
