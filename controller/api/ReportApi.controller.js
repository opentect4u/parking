const Joi = require("joi");
const { db_Select } = require("../../model/Master.model");
const { sendOkResponce, sendErrorResponce } = require("response-json-format");
const dateFormat = require('dateformat');

const vehicle_wise = async (req, res) => {
    try {
        const schema = Joi.object({
            from_date: Joi.string().required(),
            to_date: Joi.string().required()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(null, errors));
        }


        const userData = req.user;
        // const tablename = `td_vehicle_in a,td_receipt b,md_vehicle c`,
        //     where = `b.vehicle_in_id=a.vehicle_in_id AND c.vehicle_id=a.vehicle_id AND a.customer_id=${userData.customer_id} AND a.device_id='${userData.device_id}' AND a.user_id_in=${userData.id}  AND date(a.created_at) BETWEEN '${value.from_date}' AND '${value.to_date}' `,
        //     orderby = `GROUP BY a.vehicle_id`;
        // var data = await db_Select('a.*,SUM(b.paid_amt) AS paid_amt,c.*', tablename, where, orderby)
        // console.log(data)





        var select = `d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) tot_amt, SUM(c.advance_amt) advance_amt`,
            table_name = 'td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d',
            whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.car_out_flag = 'Y' AND DATE(b.date_time_out) BETWEEN '${value.from_date}' AND '${value.to_date}' AND a.customer_id = '${userData.customer_id}'`,
            order = 'GROUP BY a.vehicle_id';
        var res_dt = await db_Select(select, table_name, whr, order)




        res.json(sendOkResponce(data, null));
    } catch (err) {
        res.json(sendErrorResponce(err));
    }
}


const unbilled = async (req, res) => {
    try {
        const schema = Joi.object({
            from_date: Joi.string().required(),
            to_date: Joi.string().required()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(null, errors));
        }


        const userData = req.user;
        // const tablename = `td_vehicle_in a,md_vehicle c`,
        //     where = `c.vehicle_id=a.vehicle_id AND c.customer_id=a.customer_id AND a.customer_id=${userData.customer_id} AND a.device_id='${userData.device_id}' AND a.user_id_in=${userData.id}  AND date(a.created_at) BETWEEN '${value.from_date}' AND '${value.to_date}' `,
        //     orderby = `GROUP BY a.vehicle_id`;
        // var data = await db_Select('a.*,SUM(b.paid_amt) AS paid_amt,c.*', tablename, where, orderby)
        // console.log(data)


        var select = `a.receipt_no, a.date_time_in, a.device_id, d.vehicle_name, a.vehicle_no, f.operator_name, g.advance_amt`,
            table_name = `td_vehicle_in a JOIN  md_vehicle d ON  a.vehicle_id=d.vehicle_id
            JOIN md_user e  ON a.user_id_in=e.id 
            JOIN md_operator f ON e.user_id=f.user_id  
            LEFT JOIN td_receipt g ON a.receipt_no = g.receipt_no`,
            whr = `a.car_out_flag = 'N' AND DATE(a.date_time_in) BETWEEN '${value.from_date}' AND '${value.to_date}' AND a.customer_id = '${userData.customer_id}'`,

            order = 'ORDER BY a.receipt_no';
        var res_dt = await db_Select(select, table_name, whr, order)


        res.json(sendOkResponce(data, null));
    } catch (err) {
        res.json(sendErrorResponce(err));
    }
}


const dashboard = async (req, res) => {
    try {
        const userData = req.user;

        let datetime = dateFormat(new Date(), "yyyy-mm-dd")

        var select = `SUM(b.paid_amt) as paid_amt`,
            table_name = 'td_vehicle_in a, td_receipt b',
            whr = `a.receipt_no=b.receipt_no AND DATE(a.date_time_in)='${datetime}' AND a.customer_id = '${userData.customer_id}'`
        var paid_amt = await db_Select(select, table_name, whr, null)

        var select2 = `count(*) as vehicle_out `,
            table_name2 = 'td_vehicle_in a, td_vehicle_out b ',
            whr2 = `a.receipt_no=b.receipt_no AND DATE(b.date_time_out)='${datetime}' AND a.customer_id = '${userData.customer_id}'`
        var vehicle_out = await db_Select(select2, table_name2, whr2, null)



        var select3 = `count(*) as vehicle_in `,
            table_name3 = 'td_vehicle_in a',
            whr3 = `DATE(date_time_in)='${datetime}' AND a.customer_id = '${userData.customer_id}'`
        var vehicle_in = await db_Select(select3, table_name3, whr3, null)

        let data = {
            paid_amt,
            vehicle_in,
            vehicle_out

        }
        res.json(sendOkResponce(data, null));
    } catch (err) {
        res.json(sendErrorResponce(err));
    }
}


const detail_report = async (req, res) => {
    try {
        const schema = Joi.object({
            from_date: Joi.string().required(),
            to_date: Joi.string().required()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(null, errors));
        }


        const userData = req.user;
        // const tablename = `td_vehicle_in a,td_receipt b`,
        //     where = `b.vehicle_in_id=a.vehicle_in_id AND a.customer_id=${userData.customer_id} AND a.device_id='${userData.device_id}' AND a.user_id_in=${userData.id}  AND date(a.created_at) BETWEEN '${value.from_date}' AND '${value.to_date}'`;
        // var data = await db_Select('a.*,b.*', tablename, where, null)
        // console.log(data)


        var select = `a.receipt_no, a.date_time_in, a.device_id, d.vehicle_name, a.vehicle_no, b.date_time_out, b.device_id device_id_out, c.base_amt, c.cgst, c.sgst, c.paid_amt, c.advance_amt, f.operator_name`,
            table_name = 'td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f',
            whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.car_out_flag = 'Y' AND DATE(b.date_time_out) BETWEEN '${value.from_date}' AND '${value.to_date}' AND a.customer_id = '${userData.customer_id}'`,
            order = 'ORDER BY a.receipt_no';
        var data = await db_Select(select, table_name, whr, order)


        res.json(sendOkResponce(data, null));
    } catch (err) {
        res.json(sendErrorResponce(err));
    }
}



const shift_wise = async (req, res) => {
    try {
        const schema = Joi.object({
            from_date: Joi.string().required(),
            to_date: Joi.string().required()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(null, errors));
        }


        const userData = req.user;
        const select = `a.shift_name, (SELECT COUNT(*) FROM td_vehicle_in AS b, td_receipt AS e WHERE e.vehicle_in_id = b.vehicle_in_id AND date (b.date_time_in) >= '${value.from_date}' AND date(b.date_time_in) <= '${value.to_date}' AND time(b.date_time_in) >= a.f_time AND time(b.date_time_in) <= a.t_time) AS quantity, (SELECT SUM(f.paid_amt) FROM td_vehicle_in AS c, td_receipt AS f WHERE f.vehicle_in_id = c.vehicle_in_id AND f.trans_flag = 'P' AND date(c.date_time_in) >= '${value.from_date}' AND date(c.date_time_in) <= '${value.to_date}' AND time(c.date_time_in) >= a.f_time AND time(c.date_time_in) <= a.t_time) AS totalAmount, (SELECT SUM(g.advance_amt) FROM td_vehicle_in AS d, td_receipt AS g WHERE g.vehicle_in_id = d.vehicle_in_id AND g.trans_flag = 'A' AND date(d.date_time_in) >= '${value.from_date}' AND date(d.date_time_in) <= '${value.to_date}' AND time(d.date_time_in) >= a.f_time AND time(d.date_time_in) <= a.t_time) AS TotalAdvance , h.operator_name,h.user_id`,
            tablename = `md_shift AS a, md_operator AS h `,
            where = `h.customer_id=a.customer_id AND h.customer_id=${userData.customer_id}`;
        var data = await db_Select(select, tablename, where, null)
        console.log(data,"lalalalalalalal")
        res.json(sendOkResponce(data, null));
    } catch (err) {
        res.json(sendErrorResponce(err));
    }
}


const operator_wise = async (req, res) => {
    try {
        const schema = Joi.object({
            from_date: Joi.string().required(),
            to_date: Joi.string().required()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(null, errors));
        }


        const userData = req.user;

        var select = `b.device_id mc_srl_no_out, d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) tot_amt, SUM(c.advance_amt) as adv_amt, f.operator_name opratorName`,
            table_name = 'td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f',
            whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.car_out_flag = 'Y' AND DATE(b.date_time_out) BETWEEN '${value.from_date}' AND '${value.to_date}' AND a.customer_id = '${userData.customer_id}'`,
            order = 'GROUP BY a.user_id_in';
        var data = await db_Select(select, table_name, whr, order)

        // select adv_amt



        // const tablename=`td_vehicle_in a,td_receipt b,md_vehicle c, md_user d, md_operator e `,
        // where=`b.vehicle_in_id=a.vehicle_in_id AND c.vehicle_id=a.vehicle_id AND d.id=a.user_id_in AND e.user_id=d.user_id AND a.customer_id=${userData.customer_id} AND date(a.created_at) BETWEEN '${value.from_date}' AND '${value.to_date}' `,
        // orderby=`GROUP BY e.user_id_in`;
        // var data=await db_Select('a.*,SUM(b.paid_amt) AS paid_amt,c.*,e.*',tablename,where,orderby)
        // console.log(data)
        res.json(sendOkResponce(data, null));
    } catch (err) {
        res.json(sendErrorResponce(err));
    }
}


const unbilled_report = async (req, res) => {
    try {
        const schema = Joi.object({
            from_date: Joi.string().required(),
            to_date: Joi.string().required()
        });
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = {};
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message;
            });
            return res.json(sendErrorResponce(null, errors));
        }


        const userData = req.user;
        const tablename = `td_vehicle_in a,td_receipt b`,
            where = `b.vehicle_in_id=a.vehicle_in_id AND a.customer_id=${userData.customer_id} AND a.device_id='${userData.device_id}' AND a.user_id_in=${userData.id}  AND date(a.created_at) BETWEEN '${value.from_date}' AND '${value.to_date}'`;
        var data = await db_Select('a.*,b.*', tablename, where, null)
        console.log(data)
        res.json(sendOkResponce(data, null));
    } catch (err) {
        res.json(sendErrorResponce(err));
    }
}


const shift_wise_report = async (req, res) => {
    try {

        var custId = req.user.customer_id,
            userType = req.user.user_type;

        var data = req.body;


        let shift_time = await db_Select('f_time, t_time', 'md_shift', `shift_id=${data.shift_id}`, null)
        let ftime = shift_time.msg[0].f_time;
        let ttime = shift_time.msg[0].t_time;

        var select = `b.device_id mc_srl_no_out, d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) tot_amt, SUM(c.advance_amt) advance_amt, f.operator_name opratorName`,
            table_name = 'td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f',
            whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.car_out_flag = 'Y' AND DATE(b.date_time_out) BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND TIME(b.date_time_out) BETWEEN '${ftime}' AND '${ttime}' AND a.customer_id = '${custId}'`,
            order = 'GROUP BY a.user_id_in';
        var res_dt = await db_Select(select, table_name, whr, order)
        // res.send(res_dt)

        res.json(sendOkResponce(res_dt, null));
    } catch (e) {
        res.json(sendErrorResponce(e));
    }

}

module.exports = { vehicle_wise, shift_wise, detail_report, operator_wise, unbilled_report, unbilled, dashboard, shift_wise_report };