import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";

function useCheckAdvance() {
    const check_Advance = async (receipt_no) => {
        
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
            // console.log(receipt_no, 'lllllllllllll')
             axios.post(
                    ADDRESSES.CHECK_ADV_AMOUNT,
                    {
                        receipt_no: receipt_no
                    },
                    {
                        headers: {
                            Authorization: loginData.token,
                        },
                    },
                    
                )
                .then(res => {
                    console.log("res - operator_wise - useCheckAdvance", res.data);
                    // console.log('pppppppppp', err);
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("res - operator_wise - useCheckAdvance", err);
                    // console.log('ttttttttttt', err);
                    reject(err);
                });
        });
    };


    return { check_Advance };
}

export default useCheckAdvance;
