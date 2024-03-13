const Joi = require("joi");
const { db_Select } = require("../../model/Master.model");
const { sendErrorResponce, sendOkResponce } = require("../../utils/ResponceAssets");

const general_settings = async (req, res) => {
    try {
        const schema = Joi.object({
            //customer_id: Joi.string().required()
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
        let where = `customer_id=${userData.customer_id} AND app_id='${userData.device_id}'`
        var data = await db_Select('*', 'md_setting', where, null)
        res.json(sendOkResponce(data, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}




const receipt_setting = async (req, res) => {
    try {
        const schema = Joi.object({
            //key: Joi.string().required()
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
        let where = `customer_id=${userData.customer_id}`
        var data = await db_Select('*', 'md_receipt_setting', where, null)
        res.json(sendOkResponce(data, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}




const rate_dtls_list = async (req, res) => {
    try {
        const schema = Joi.object({
            dev_mod: Joi.string().valid('D', 'R', 'B', 'F', 'A').required()
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
        let where = `customer_id=${userData.customer_id}`;
        // let where=`customer_id=${userData.customer_id} AND rate_type='${value.dev_mod}'`;
        var data = await db_Select('*', 'md_rate_dtls', where, null)
        res.json(sendOkResponce(data, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}



const fixed_rate_dtls_list = async (req, res) => {
    try {
        const schema = Joi.object({
            // dev_mod: Joi.string().valid('D', 'R', 'B', 'F', 'A').required(),
            vehicle_id: Joi.number().required()
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
        let where = `customer_id=${userData.customer_id} AND vehicle_id=${value.vehicle_id}`,
        order=`ORDER BY from_hour`;
        // let where=`customer_id=${userData.customer_id} AND rate_type='${value.dev_mod}' AND vehicle_id=${value.vehicle_id}`;
        var data = await db_Select('*', 'md_rate_dtls', where, order)
        res.json(sendOkResponce(data, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}



const gst_list = async (req, res) => {
    try {
        const schema = Joi.object({
            //dev_mod: Joi.string().required()
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
        // let where=`customer_id=${userData.customer_id} AND gst_flag='Y'`;
        let where = `customer_id=${userData.customer_id}`;
        var data = await db_Select('*', 'md_gst', where, null)
        res.json(sendOkResponce(data, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}


const my_shift = async (req, res) => {
    try {
        custId = req.user.customer_id;
        shiftData = await db_Select('shift_id, shift_name', 'md_shift', `customer_id=${custId}`, 'ORDER BY f_time')
        res.json(sendOkResponce(shiftData, null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}
module.exports = { general_settings, receipt_setting, rate_dtls_list, fixed_rate_dtls_list, gst_list, my_shift }