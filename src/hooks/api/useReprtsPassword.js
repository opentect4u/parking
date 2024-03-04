import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function useReprtsPassword() {
    const check_password = async (password) => {

        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
            axios.post(ADDRESSES.CHECKED_REPORT_PASSWORD,
                {
                    password: password
                },
                {
                    headers: {
                        Authorization: loginData.token,
                    },
                },
            )
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };


    return { check_password };
}

export default useReprtsPassword;
