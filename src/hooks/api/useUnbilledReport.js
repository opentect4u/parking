import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function useUnbilledReport() {
    const unbilledReportData = async (fDate,tDate) => {
        
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
             axios.post(
                    ADDRESSES.UNBILLED_RERORT,
                    {
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
                    console.log("res - vehicleWiseReports - useUnbilledReport", res.data);
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("res - vehicleWiseReports - useUnbilledReport", err);
                    reject(err);
                });
        });
    };


    return { unbilledReportData };
}

export default useUnbilledReport;
