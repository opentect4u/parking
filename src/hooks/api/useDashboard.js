import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function useDashboard() {
    const getDashboardData = async (getUserName) => {
        
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
            
             axios.get(
                    ADDRESSES.DASHBOARD_DATA + '?customerUserName=' + getUserName,
                    {
                        headers: {
                            Authorization: loginData.token,
                        },
                    },
                )
                .then(res => {
                    console.log("res - vehicleWiseReports - useDashboard", res.data);
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("res - vehicleWiseReports - useDashboard", err);
                    reject(err);
                });
        });
    };


    return { getDashboardData };
}

export default useDashboard;
