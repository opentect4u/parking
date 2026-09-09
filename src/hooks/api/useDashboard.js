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
                    // console.log(loginData.token, "res - vehicleWiseReports - useDashboard", res.data, 'kkkkkkkkkkkkk');
                    console.log('hhhhhhh', res.data?.data?.vehicle_in?.msg[0], 'hhhhhhh11',
                        res.data?.data?.vehicle_out?.msg[0], 'hhhhhhh22', 
                        res.data?.data?.paid_amt?.msg[0], 'hhhhhhh33',
                        res.data?.data?.advance_amt?.msg[0]?.advance_amt, 
                        "vehicleWiseReports", res.data, 'kkkkkkkkkkkkk');
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
