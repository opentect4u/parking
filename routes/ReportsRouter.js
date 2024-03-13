const { AuthCheckedMW } = require('../middleware/AuthChecked.middleware');
const { db_Select } = require('../model/Master.model');

const express = require('express'),
    reportRouter = express.Router(),
    dateFormat = require('dateformat');



reportRouter.get('/', AuthCheckedMW, async (req, res) => {
    res.redirect('/report/unbilled_report')
});

reportRouter.get('/details_report', AuthCheckedMW, async (req, res) => {
    var data = {
        title: 'Detail Report',
        page_path: 'reports/details_report',
        dtFormat: dateFormat
    }
    res.render('common/layouts/main', data)
})

reportRouter.get('/details_report_new', AuthCheckedMW, async (req, res) => {
    var data = {
        title: 'Detail Report',
        page_path: 'reports/detail_report_new.ejs',
        dtFormat: dateFormat
    }
    res.render('common/layouts/main', data)
})

reportRouter.post('/get_details_report', AuthCheckedMW, async (req, res) => {
    var custId = req.session.user.user_data.customer_id,
        userType = req.session.user.user_data.user_type;

    var data = req.body;
    var select = `receiptNo, date_time_in, mc_srl_no, vehicleType, vehicle_no, opratorName, date_time_out, paid_amt, mc_srl_no_out`,
        table_name = 'td_backlog_data',
        whr = `DATE(date_time_out) BETWEEN '${data.frm_dt}' AND '${data.to_dt}'`,
        order = 'ORDER BY receiptNo';
    var res_dt = await db_Select(select, table_name, whr, order)
    res.send(res_dt)
})

reportRouter.post('/get_details_report_new', AuthCheckedMW, async (req, res) => {
    var custId = req.session.user.user_data.customer_id,
        userType = req.session.user.user_data.user_type;

    var data = req.body;
    var select = `a.receipt_no, a.date_time_in, a.device_id, d.vehicle_name, a.vehicle_no, b.date_time_out, b.device_id device_id_out, c.base_amt, c.advance_amt, c.cgst, c.sgst, c.paid_amt, f.operator_name`,
        table_name = 'td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f',
        whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.car_out_flag = 'Y' AND b.date_time_out BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${custId}'`,
        order = 'ORDER BY a.receipt_no';
    var res_dt = await db_Select(select, table_name, whr, order)
    // console.log(res_dt);
    res.send(res_dt)
})

reportRouter.get('/unbilled_report', AuthCheckedMW, async (req, res) => {
    var data = {
        title: 'Unbilled Report',
        page_path: 'reports/unbilled_report.ejs',
        dtFormat: dateFormat
    }
    res.render('common/layouts/main', data)
})

reportRouter.post('/get_unbilled_report', AuthCheckedMW, async (req, res) => {
    var custId = req.session.user.user_data.customer_id,
        userType = req.session.user.user_data.user_type;

    var data = req.body;
    var select = `a.receipt_no, a.date_time_in, a.device_id, d.vehicle_name, a.vehicle_no, f.operator_name, g.advance_amt`,
        table_name = `td_vehicle_in a JOIN  md_vehicle d ON  a.vehicle_id=d.vehicle_id
        JOIN md_user e  ON a.user_id_in=e.id 
        JOIN md_operator f ON e.user_id=f.user_id  
        LEFT JOIN td_receipt g ON a.receipt_no = g.receipt_no`,
        whr = `a.car_out_flag = 'N' AND a.date_time_in BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${custId}'`,
        order = 'ORDER BY a.receipt_no';
    var res_dt = await db_Select(select, table_name, whr, order)
    res.send(res_dt)
})

reportRouter.get('/veh_wise_repo', AuthCheckedMW, async (req, res) => {
    var data = {
        title: 'Veichle Wise Report',
        page_path: 'reports/veh_wise_repo',
        dtFormat: dateFormat
    }
    res.render('common/layouts/main', data)
})

reportRouter.get('/veh_wise_repo_new', AuthCheckedMW, async (req, res) => {
    var data = {
        title: 'Veichle Wise Report',
        page_path: 'reports/veh_wise_repo_new',
        dtFormat: dateFormat
    }
    res.render('common/layouts/main', data)
})

reportRouter.post('/get_veh_wise_report', AuthCheckedMW, async (req, res) => {
    var data = req.body;
    var select = `mc_srl_no_out, vehicleType, COUNT(receiptNo) tot_vehi, SUM(paid_amt) tot_amt`,
        table_name = 'td_backlog_data',
        whr = `DATE(date_time_out) BETWEEN '${data.frm_dt}' AND '${data.to_dt}'`,
        order = 'GROUP BY vehicleType, mc_srl_no_out';
    var res_dt = await db_Select(select, table_name, whr, order)
    res.send(res_dt)
})

reportRouter.post('/get_veh_wise_report_new', AuthCheckedMW, async (req, res) => {
    var custId = req.session.user.user_data.customer_id,
        userType = req.session.user.user_data.user_type;

    var data = req.body;
    var select = `d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) paid_amt, SUM(c.advance_amt) advance_amt`,
        table_name = 'td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d',
        whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.car_out_flag = 'Y' AND b.date_time_out BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${custId}'`,
        order = 'GROUP BY a.vehicle_id';
    var res_dt = await db_Select(select, table_name, whr, order)
    // console.log(res_dt);
    res.send(res_dt)
})

reportRouter.get('/dev_wise_repo', AuthCheckedMW, async (req, res) => {
    var data = {
        title: 'Device Wise Report',
        page_path: 'reports/dev_wise_repo',
        dtFormat: dateFormat
    }
    res.render('common/layouts/main', data)
})

reportRouter.get('/dev_wise_repo_new', AuthCheckedMW, async (req, res) => {
    var data = {
        title: 'Device Wise Report',
        page_path: 'reports/dev_wise_repo_new',
        dtFormat: dateFormat
    }
    res.render('common/layouts/main', data)
})

reportRouter.post('/get_dev_wise_report', AuthCheckedMW, async (req, res) => {
    var data = req.body;
    var select = `vehicleType, COUNT(receiptNo) tot_vehi, SUM(paid_amt) tot_amt`,
        table_name = 'td_backlog_data',
        whr = `DATE(date_time_out) BETWEEN '${data.frm_dt}' AND '${data.to_dt}'`,
        order = 'GROUP BY vehicleType';
    var res_dt = await db_Select(select, table_name, whr, order)
    res.send(res_dt)
})

reportRouter.post('/get_dev_wise_report_new', AuthCheckedMW, async (req, res) => {
    var custId = req.session.user.user_data.customer_id,
        userType = req.session.user.user_data.user_type;

    var data = req.body;
    var select = `b.device_id mc_srl_no_out, d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) paid_amt, SUM(c.advance_amt) advance_amt`,
        table_name = 'td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d',
        whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.car_out_flag = 'Y' AND b.date_time_out BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${custId}'`,
        order = 'GROUP BY b.device_id';
    var res_dt = await db_Select(select, table_name, whr, order)
    console.log(res_dt);
    res.send(res_dt)
})

reportRouter.get('/usr_wise_repo', AuthCheckedMW, async (req, res) => {
    var data = {
        title: 'User Wise Report',
        page_path: 'reports/usr_wise_repo',
        dtFormat: dateFormat
    }
    res.render('common/layouts/main', data)
})

reportRouter.get('/usr_wise_repo_new', AuthCheckedMW, async (req, res) => {
    var data = {
        title: 'User Wise Report',
        page_path: 'reports/usr_wise_repo_new',
        dtFormat: dateFormat
    }
    res.render('common/layouts/main', data)
})

reportRouter.post('/get_user_wise_report', AuthCheckedMW, async (req, res) => {
    var data = req.body;
    var select = `opratorName, mc_srl_no_out, COUNT(receiptNo) tot_vehi, SUM(paid_amt) tot_amt`,
        table_name = 'td_backlog_data',
        whr = `DATE(date_time_out) BETWEEN '${data.frm_dt}' AND '${data.to_dt}'`,
        order = 'GROUP BY opratorName, mc_srl_no_out';
    var res_dt = await db_Select(select, table_name, whr, order)
    res.send(res_dt)
})

reportRouter.post('/get_user_wise_report_new', AuthCheckedMW, async (req, res) => {
    var custId = req.session.user.user_data.customer_id,
        userType = req.session.user.user_data.user_type;

    var data = req.body;
    var select = `b.device_id mc_srl_no_out, d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) paid_amt, SUM(c.advance_amt) advance_amt, f.operator_name opratorName`,
        table_name = 'td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f',
        whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.car_out_flag = 'Y' AND b.date_time_out BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND a.customer_id = '${custId}'`,
        order = 'GROUP BY a.user_id_in';
    var res_dt = await db_Select(select, table_name, whr, order)
    res.send(res_dt)
})



reportRouter.get('/shift_wise_repo', AuthCheckedMW, async (req, res) => {
    var custId = req.session.user.user_data.customer_id,
        shiftData = await db_Select('shift_id, shift_name, f_time, t_time', 'md_shift', `customer_id=${custId}`, 'ORDER BY f_time')
    // console.log(shiftData)

    var data = {
        title: 'Shiftwise Report',
        page_path: 'reports/shift_report_new',
        dtFormat: dateFormat,
        shiftData: shiftData
    }
    res.render('common/layouts/main', data)
})



reportRouter.post('/shift_wise_repo', AuthCheckedMW, async (req, res) => {
    var custId = req.session.user.user_data.customer_id,
        userType = req.session.user.user_data.user_type;

    var data = req.body;


    let shift_time=await db_Select('f_time, t_time', 'md_shift', `shift_id=${data.shift_id}`, null)
    let ftime=shift_time.msg[0].f_time;
    let ttime=shift_time.msg[0].t_time;

    var select = `b.device_id mc_srl_no_out, d.vehicle_name vehicleType, COUNT(b.receipt_no) tot_vehi, SUM(c.paid_amt) paid_amt, SUM(c.advance_amt) advance_amt, f.operator_name opratorName`,
        table_name = 'td_vehicle_in a, td_vehicle_out b, td_receipt c, md_vehicle d, md_user e, md_operator f',
        whr = `a.receipt_no=b.receipt_no AND a.receipt_no=c.receipt_no AND a.vehicle_id=d.vehicle_id AND a.user_id_in=e.id AND e.user_id=f.user_id AND a.car_out_flag = 'Y' AND DATE(b.date_time_out) BETWEEN '${data.frm_dt}' AND '${data.to_dt}' AND TIME(b.date_time_out) BETWEEN '${ftime}' AND '${ttime}' AND a.customer_id = '${custId}'`,
        order = 'GROUP BY a.user_id_in';
    var res_dt = await db_Select(select, table_name, whr, order)
    res.send(res_dt)
})



module.exports = { reportRouter }