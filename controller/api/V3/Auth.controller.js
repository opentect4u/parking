const Joi = require("joi");
const bcrypt = require('bcrypt');
const dateFormat = require('dateformat');
const { sendErrorResponce, sendOkResponce } = require("../../../utils/ResponceAssets");
const { db_Insert, db_Select } = require("../../../model/Master.model");

const { createToken } = require("../../../utils/jwt.util");

const register = async (req, res) => {
    try {
        const schema = Joi.object({
            operator_name: Joi.string().required(),
            seller_id: Joi.required(),
            customer_id: Joi.required(),
            user_type: Joi.required(),
            password: Joi.string().required(),
            device_id: Joi.string().required(),
            user_id: Joi.required(),
            allow_flag: Joi.required(),
            location_id: Joi.required(),
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(errors));
        }


        let pss = value.password
        let enc_pss = bcrypt.hashSync(pss, 10)
        let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")

        let fields = `(seller_id, customer_id, user_type, password, device_id, user_id, allow_flag, created_at, updated_at)`,
            values = `('${value.seller_id}','${value.customer_id}','${value.user_type}','${enc_pss}','${value.device_id}','${value.user_id}','${value.allow_flag}','${datetime}','${datetime}')`;
        var userdata = await db_Insert("md_user", fields, values, null, 0)
        if (userdata.suc == 1) {
            let fields2 = `(operator_name, user_id, app_id, customer_id, location_id, created_at, updated_at)`,
                values2 = `('${value.operator_name}','${value.user_id}','${value.device_id}','${value.customer_id}','${value.location_id}','${datetime}','${datetime}')`;
            var userdata2 = await db_Insert("md_operator", fields2, values2, null, 0)
        }
        res.json(sendOkResponce({ userdata, userdata2 }, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }

}


const login = async (req, res) => {
    try {
        const schema = Joi.object({
            password: Joi.string().required(),
            user_id: Joi.string().required(),
            device_id: Joi.string().required()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(errors));
        }

        let whr = `user_id='${value.user_id}' AND allow_flag='Y' AND user_type='O'`
        // let whr = `user_id='${value.user_id}' AND allow_flag='Y' AND device_id='${value.device_id}'`
        var userData = await db_Select("password, customer_id", 'md_user', whr, null)
        if ((userData.msg).length == 1) {
            if (await bcrypt.compare(value.password, userData.msg[0].password)) {
                var tot_user = await db_Select('no_device', 'md_customer', `customer_id = ${userData.msg[0].customer_id}`, null)
                var tot_active_user = await db_Select('count(id) tot_act_user', 'md_user', `customer_id = ${userData.msg[0].customer_id} AND login_status = 'Y'`, null)
                var tot_user_count = tot_user.suc > 0 ? (tot_user.msg.length > 0 ? tot_user.msg[0].no_device : 0) : 0;
                  var tot_active_user_count = tot_active_user.suc > 0 ? tot_active_user.msg[0].tot_act_user : 0
                  console.log(tot_user_count,tot_active_user_count,'pp');
                if(tot_user_count > tot_active_user_count){
                    let aaa= await db_Insert('md_user',`device_id='${value.device_id}'`,null,whr,1)
                
                    let table = `md_user a,md_customer b,md_seller c,md_operator d,md_setting e`,
                        selectData = `a.user_type, a.id, a.device_id, a.user_id,b.no_device,c.*,b.customer_id,b.seller_id, b.customer_name,b.location_id,b.mobile_no,b.email,b.cust_addr,b.dev_mod,b.no_device,IF(b.customer_type = 'P', 'Parking Fees', IF(b.customer_type = 'T', 'Toll Fare', '')) customer_type, b.customer_type customer_type_id,b.device_type,d.*,e.*`,
                        whr2 = `a.customer_id=b.customer_id AND a.seller_id=c.seller_id AND a.user_id=d.user_id AND e.customer_id=a.customer_id AND e.app_id='${value.device_id}'  AND a.user_id='${value.user_id}' AND a.allow_flag='Y' AND a.device_id='${value.device_id}'`
                    var userData2 = await db_Select(selectData, table, whr2, null)
                        console.log(userData2)
                    if ((userData2.msg).length == 1) {
                        var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
                        await db_Insert('md_user', `login_status = 'Y', last_login = '${datetime}'`, null, `id= ${userData2.msg[0].id}`, 1)
                        delete userData2.msg[0].password
                        let data = {
                            time: Date(),
                            userdata: userData2
                        }
                        const token = createToken(data);
                        // if(tot_user_count >= tot_active_user_count){
                        //     var last_logged_in_user_dtls = await db_Select('id, socket_id, last_login', 'md_user', `customer_id = ${userData.msg[0].customer_id} AND login_status = 'Y'`, 'LIMIT 1')
                        //     var update_log_user = await db_Insert('md_user', `login_status = 'N'`, null, `id = ${last_logged_in_user_dtls.msg[0].id}`, 1)
                        //     console.log(update_log_user, 'update_log_user');
                        //     if(update_log_user.suc > 0){
                        //         req.io.to(last_logged_in_user_dtls.msg[0].socket_id).emit('device status', {suc: 1, msg: {login_status: 'N'}})
                        //     }
                        // }
                        res.json(sendOkResponce({ token: token, user: data }, null));
                    } else {
                        res.json(sendErrorResponce(null, 'invalid Information'));
                    }
                }else{
                    res.send({status: false, message: {tot_limit: tot_user_count, tot_act_user: tot_active_user_count, msg: 'Total login limit excided'}})
                    // res.json(sendErrorResponce(null, 'Number of user loggedin excided'));
                }

            } else {
                res.json(sendErrorResponce(null, 'invalid password'));
            }
        } else {
            res.json(sendErrorResponce(null, 'invalid username'));
        }
    } catch (error) {
        // console.log(error);
        res.json(sendErrorResponce(error));
    }
}

const logout = async (req, res) =>{
    try{
         const schema = Joi.object({
           user_id: Joi.string(),
           device_id: Joi.string()
         });
         const { error, value } = schema.validate(req.body, { abortEarly: false });
         console.log(value,'ss');
         if (error) {
             const errors = {};
             error.details.forEach(detail => {
                 errors[detail.context.key] = detail.message;
             });
             return res.json(sendErrorResponce(errors));
         }  
         const userData = req.user;  
        //  console.log(userData,'userdata');
         let fields=`login_status = 'N'`,
               whr=`user_id='${value.user_id}' AND device_id='${value.device_id}'`
               var changestatus= await db_Insert("md_user", fields, null, whr, 1)
        if(changestatus.suc > 0){
            res.json(sendOkResponce("Logout successfully ", null));
        } else {
            res.json(sendErrorResponce(null, 'Data Not Updated'));
        }       

    } catch (error){
        console.log(error);
        // res.json(sendErrorResponce(error));
    }
}

const change_password = async (req, res) => {
    try {
        const schema = Joi.object({
            password: Joi.string().required(),
            old_password: Joi.string(),
            confirm_password: Joi.string().valid(Joi.ref('password')).required().strict()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(errors));
        }
        const userData = req.user;
        let pss = value.password
        let enc_pss = bcrypt.hashSync(pss, 10)

        let whr = `user_id='${userData.user_id}' AND allow_flag='Y' AND device_id='${userData.device_id}'`
        var user_info = await db_Select("password", 'md_user', whr, null)
        if ((user_info.msg).length == 1) {
            if (await bcrypt.compare(value.old_password, user_info.msg[0].password)) {
               let fields=`password='${enc_pss}'`,
               whr=`user_id='${userData.user_id}' AND allow_flag='Y' AND device_id='${userData.device_id}'`
               var changepass= await db_Insert("md_user", fields, null, whr, 1)
               res.json(sendOkResponce("Password change successfully ", null));
            } else {
                res.json(sendErrorResponce(null, 'invalid old password'));
            }
        } else {
            res.json(sendErrorResponce(null, 'invalid username'));
        }
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}


const test = async (req, res) => {
    try {
        res.json(sendOkResponce(req.user, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}

const check_report_password = async (req, res) =>{
    try{
     const schema = Joi.object({
        password: Joi.required(),
     });
     const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(errors));
        }

      

        const userData = req.user;

        // await bcrypt.compare(value.password, res_dt.msg[0].password)

        let whr = `customer_id=${userData.customer_id}`
        var pwdData = await db_Select("*", 'md_setting', whr, null)

        console.log(pwdData,"1234");
        if ((pwdData.msg).length > 0 && await bcrypt.compare(value.password, pwdData.msg[0].password)) {
           let data = {
            reportpwddata: 1
           }
            res.json(sendOkResponce(data, null));

        } else {
            res.json(sendErrorResponce(null, 'invalid username'));
        }
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}

module.exports = { register, login,change_password, test, check_report_password, logout };