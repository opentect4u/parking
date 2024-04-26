import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function userLogOut() {
    const logOut_hook = async () => {
        
        const loginData = JSON.parse(loginStorage.getString("login-data"));

        return new Promise((resolve, reject) => {
            
             axios.post(
                    ADDRESSES.USERID_DEVICEID_SEND_LOGOUT,
                    {
                        device_id: loginData.user.userdata.msg[0].device_id,
                        user_id: loginData.user.userdata.msg[0].user_id,
                    },
                    {
                        headers: {
                            Authorization: loginData.token,
                        },
                    },
                )
                .then(res => {
                    console.log("res - logOut - userLogOut___then", res.data);
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("res - logOut - userLogOut___catch", err);
                    reject(err);
                });
        });
    };


    return { logOut_hook };
}

export default userLogOut;
