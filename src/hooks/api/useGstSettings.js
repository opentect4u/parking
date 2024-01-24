import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function useGstSettings() {
    const handleGetGst = async () => {
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
            axios.post(ADDRESSES.GST_LIST,
                {},
                {
                    headers: {
                        Authorization: loginData.token,
                    },
                },).then(res => {
                    resolve(res.data.data.msg);
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    return { handleGetGst };
}

export default useGstSettings;
