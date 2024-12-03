import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function useDetailedReportScreen() {
    const dublicatePrintScreen = async (fDate,tDate, getUserName, getin_outValue) => {
        // console.log(fDate,tDate, getUserName, getin_outValue, 'ppppppppppppppppppppppppppp');
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
             axios.post(
                    ADDRESSES.CAR_IN_OUT,
                    {
                        customerUserName: getUserName,
                        from_date: fDate,
                        to_date: tDate,
                        car_flag: getin_outValue,
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


    return { dublicatePrintScreen };
}

export default useDetailedReportScreen;
