const Joi = require("joi");
const bcrypt = require('bcrypt');
const dateFormat = require('dateformat');
const { db_Select, db_Insert } = require("../../model/Master.model");
const logger = require('../../model/LoggerModel');

const test = async (req, res) => {
    try {
        req.flash('error', "Bank Add Successful");
        res.render('auth/login');
    } catch (err) {
        req.flash('success', "Bank Add Successful");
        res.render('auth/login');
    }
}


const login = async (req, res) => {
    try {
        req.flash('error', "Bank Add Successful");
        res.render('auth/login');
    } catch (err) {
        req.flash('success', "Bank Add Successful");
        res.render('auth/login');
    }
}


const login_post = async (req, res) => {
    try {
        const schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            res.flash('error', errors);
            res.redirect('/login');
        }
        const user_id = value.username,
            password = value.password;
        var whr = `user_id='${user_id}' AND user_type IN ('S', 'C') AND allow_flag='Y'`;
        let res_dt = await db_Select('password,user_type', "md_user", whr, null);
        delete res_dt.sql;
        if((res_dt.msg).length==1){
        if (res_dt.msg[0] && await bcrypt.compare(password, res_dt.msg[0].password)) {

            if (res_dt.msg[0].user_type == 'C') {
                var table_name = "md_user a,md_customer b,md_seller c,md_locations d",
                    whrDAta = `a.customer_id=b.customer_id AND a.seller_id=c.seller_id AND b.location_id= d.location_id AND a.user_id='${user_id}' AND a.allow_flag='Y'`,
                    selectData = "a.user_type, a.id, a.device_id, a.user_id, c.*, b.*, d.*";
            }
            let user_data = await db_Select(selectData, table_name, whrDAta, null);
            delete user_data.sql;
            if((user_data.msg).length==1){
                const datetime = dateFormat(new Date(), "dd/mm/yyyy hh:MM:ss")
                user_data = user_data.msg[0];
                req.session['user'] = { user_data, datetime }
                req.flash('success', "Login successful");
                res.redirect('/');
            }else{
                req.flash('error', "User not found");
                res.redirect('/login');
            }
        } else {
            req.flash('error', "Password Not Matched");
            res.redirect('/login');
        }

    } else {
        req.flash('error', "User Not Found");
        res.redirect('/login');
    }
    } catch (err) {
        req.flash('error', err);
        res.redirect('/login');
    }
}

const super_admin_login = (req, res) => {
    res.render('auth/superadmin_login')
}

// const super_admin_login_post = async (req, res) => {
//     try {
//         let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
//         const schema = Joi.object({
//             password: Joi.string().required(),
//             user_id: Joi.string().required(),
//         });
//         const { error, value } = schema.validate(req.body, { abortEarly: false });
//         if (error) {
//             const errors = {};
//             error.details.forEach(detail => {
//                 errors[detail.context.key] = detail.message;
//             });
//             return res.json(sendErrorResponce(errors));
//         }

//         let whr = `user_id='${value.user_id}'`
//         var userData = await db_Select("sl_no,user_id,password,user_name,user_mobile_no,last_login,created_by,created_at", 'md_super_admin', whr, null)
//         // console.log(userData);
        
//         if ((userData.msg).length == 1) {
//             if (await bcrypt.compare(value.password, userData.msg[0].password)) {
//                 try{
//                     await db_Insert('md_super_admin',`login_status = 'Y',last_login='${datetime}',updated_by='SSS',updated_at='${datetime}'`,null,`user_id='${value.user_id}'`,1)
//                     userData = userData.msg[0];
//                     // console.log(userData);
//                     req.session['user'] = { userData, datetime }
//                     req.flash('success', "Login successful");
//                     // res.redirect('/superadmin_dashboard');
//                     res.redirect('/superadmin/dashboard');
//                 }catch(err){
//                 //    console.log(err);
//                    req.flash('danger', err);
//                    res.redirect('/superadmin_login');
//                 }
               
//             } else {
//                 req.flash('danger', "Please check your userid or password");
//                 res.redirect('/superadmin_login');
//             }
//         } else {
//             req.flash('danger', "Please check your userid or password");
//             res.redirect('/superadmin_login');
//         }
//     } catch (error) {
//         // console.log(error);
//         logger.error(err); // Log the error
//         req.flash('danger', error);
//         res.redirect('/superadmin_login');
//     }
// };

// const super_admin_login_post = async (req, res) => {
//     try {
//         let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
//         const schema = Joi.object({
//             password: Joi.string().required(),
//             user_id: Joi.string().required(),
//         });
//         const { error, value } = schema.validate(req.body, { abortEarly: false });
//         if (error) {
//             const errors = {};
//             error.details.forEach(detail => {
//                 errors[detail.context.key] = detail.message;
//             });
//             return res.json(sendErrorResponce(errors));
//         }

//         let whr = `user_id='${value.user_id}' AND user_type IN ('S', 'A') AND allow_flag = 'Y'`
//         var userData = await db_Select("sl_no,customer_id,user_type,user_id,password,user_name,user_mobile_no,device_id,allow_flag,login_status,last_login,created_by,created_at", 'md_super_admin', whr, null)
//         console.log(userData);
        
//         if ((userData.msg).length == 1) {
//             if (await bcrypt.compare(value.password, userData.msg[0].password)) {
//                 try{
//                     await db_Insert('md_super_admin',`login_status = 'Y',last_login='${datetime}',updated_by='SSS',updated_at='${datetime}'`,null,`user_id='${value.user_id}'`,1)
//                     userData = userData.msg[0];
//                     // console.log(userData);
//                     req.session['user'] = { userData, datetime }
//                     req.flash('success', "Login successful");
//                     // res.redirect('/superadmin_dashboard');
//                     res.redirect('/superadmin/dashboard');
//                 }catch(err){
//                 //    console.log(err);
//                    req.flash('danger', err);
//                    res.redirect('/superadmin_login');
//                 }
               
//             } else {
//                 req.flash('danger', "Please check your userid or password");
//                 res.redirect('/superadmin_login');
//             }
//         } else {
//             req.flash('danger', "Please check your userid or password");
//             res.redirect('/superadmin_login');
//         }
//     } catch (error) {
//         // console.log(error);
//         logger.error(err); // Log the error
//         req.flash('danger', error);
//         res.redirect('/superadmin_login');
//     }
// };

const super_admin_login_post = async (req, res) => {
    try {
        let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
        const schema = Joi.object({
            password: Joi.string().required(),
            user_id: Joi.string().required(),
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(errors));
        }

        let whr = `a.user_id='${value.user_id}' AND a.user_type IN ('S', 'A') AND a.allow_flag = 'Y'`
        var userData = await db_Select("a.sl_no,a.customer_id,a.user_type,a.user_id,a.password,a.user_name,a.user_mobile_no,a.allow_flag,a.login_status,a.last_login,a.created_by,a.created_at,b.customer_name", 'md_super_admin a LEFT JOIN md_customer b ON a.customer_id = b.customer_id', whr, null)
        console.log(userData,'userdata');
        
        if ((userData.msg).length == 1) {
            if (await bcrypt.compare(value.password, userData.msg[0].password)) {
                try{
                    await db_Insert('md_super_admin',`login_status = 'Y',last_login='${datetime}',updated_by='SSS',updated_at='${datetime}'`,null,`user_id='${value.user_id}'`,1)
                    userData = userData.msg[0];

                     // 🔑 Fetch report permission flags for this user/customer
              let reportPermissionRes = await db_Select(
               "detail_report, veh_wise_report, dev_wise_report, operate_wise_report, shift_wise_report",
                "md_admin_report_permit",
                `customer_id='${userData.customer_id}'`,
                null
               );

                let reportPermission = {};
                 if (reportPermissionRes.msg.length > 0) {
            reportPermission = reportPermissionRes.msg[0];
          }

                    // console.log(userData,'data');
                    req.session['user'] = { userData, datetime, reportPermission }
                    req.flash('success', "Login successful");
                    // res.redirect('/superadmin_dashboard');
                    res.redirect('/superadmin/dashboard');
                }catch(err){
                //    console.log(err);
                   req.flash('danger', err);
                   res.redirect('/superadmin_login');
                }
               
            } else {
                req.flash('danger', "Please check your userid or password");
                res.redirect('/superadmin_login');
            }
        } else {
            req.flash('danger', "Please check your userid or password");
            res.redirect('/superadmin_login');
        }
    } catch (error) {
        // console.log(error);
        logger.error(error); // Log the error
        req.flash('danger', error);
        res.redirect('/superadmin_login');
    }
};

module.exports = { test, login, login_post, super_admin_login, super_admin_login_post };