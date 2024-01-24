import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";


function useAppUpdate() {
    const appUpdate = () => {
        return new Promise((resolve, reject) => {
            axios.post(ADDRESSES.APP_UPDATE, {
                device_mode: ["D", "R"]
            })
            .then(res => {
                console.log("res - carIn - useCarIn", res.data);
                resolve(res.data);
            })
            .catch(err => {
                console.error("res - carIn - useCarIn", err);
                reject(err);
            });
        });
    };
    return { appUpdate }
}

export default useAppUpdate;