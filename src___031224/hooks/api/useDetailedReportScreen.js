import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function useDetailedReportScreen() {
    const detailedReportScreen = async (fDate,tDate, getUserName) => {
        
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
             axios.post(
                    ADDRESSES.DETAILED_REPORT,
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
                    console.log("res - vehicleWiseReports - useDetailedReportScreen", res.data);
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("res - vehicleWiseReports - useDetailedReportScreen", err);
                    reject(err);
                });
        });
    };


    return { detailedReportScreen };
}

export default useDetailedReportScreen;
