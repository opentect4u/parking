import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function useVehicleWiseReports() {
    const vehicleWiseReportsData = async (fDate,tDate, getUserName) => {
        
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
             axios.post(
                    // ADDRESSES.OPERATORWISE_REPORT,
                    ADDRESSES.VEHICLE_WISE_REPORT,
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
                    console.log("res - vehicleWiseReports - useVehicleWiseReports", res.data);
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("res - vehicleWiseReports - useVehicleWiseReports", err);
                    reject(err);
                });
        });
    };


    return { vehicleWiseReportsData };
}

export default useVehicleWiseReports;
