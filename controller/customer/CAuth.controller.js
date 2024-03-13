const Joi = require("joi");
const bcrypt = require('bcrypt');
const dateFormat = require('dateformat');
const { db_Select } = require("../../model/Master.model");

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

module.exports = { test, login, login_post };