const Joi = require("joi")
const { sendErrorResponce, sendOkResponce } = require("response-json-format")
const { db_Select } = require("../../model/Master.model")

const app_update = async (req, res) => {
    try {
        const schema = Joi.object({
            device_mode: Joi.array().items(Joi.string().valid('D', 'R', 'B', 'F', 'A').required()).required()
            // device_mode:Joi.string().required()
        })
        const { error, value } = schema.validate(req.body, { abortEarly: false })
        if (error) {
            const errors = {}
            error.details.forEach(detail => {
                errors[detail.context.key] = detail.message
            })
            return res.json(sendErrorResponce(null, errors))
        }
        var resultString = value.device_mode.map(item => `"${item}"`).join(",");
        let where = `device_mode IN (${resultString})`
        var data = await db_Select('*', 'md_app_version', where, null)
        res.json(sendOkResponce(data, null));

    } catch (err) {
        res.json(sendErrorResponce(err))
    }
}
module.exports = { app_update }