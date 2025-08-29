const Joi = require("joi");
const { db_Select } = require("../../../model/Master.model");
const { sendErrorResponce, sendOkResponce } = require("../../../utils/ResponceAssets");

const vehicle_list=async(req,res)=>{
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
            return res.json(sendErrorResponce(null,errors));
        }
        const userData = req.user;
        console.log(userData)
        let where=`a.customer_id=${userData.customer_id} AND a.vehicle_on_off='Y'`
        var data=await db_Select('a.*,b.*','md_vehicle a LEFT JOIN md_rate_dtls b ON a.customer_id = b.customer_id AND a.vehicle_id = b.vehicle_id',where,null)
        res.json(sendOkResponce(data,null));
    } catch (error) {
        res.json(sendErrorResponce(error));
    }
}

// const vehicle_list=async(req,res)=>{
//     try {   
//         const schema = Joi.object({
//             //customer_id: Joi.string().required()
//         });
//         const { error, value } = schema.validate(req.body, { abortEarly: false });
//         if (error) {
//             const errors = {};
//             error.details.forEach(detail => {
//                 errors[detail.context.key] = detail.message;
//             });
//             return res.json(sendErrorResponce(null,errors));
//         }
//         const userData = req.user;
//         console.log(userData)
//         let where=`customer_id=${userData.customer_id} AND vehicle_on_off='Y'`
//         var data=await db_Select('*','md_vehicle',where,null)
//         res.json(sendOkResponce(data,null));
//     } catch (error) {
//         res.json(sendErrorResponce(error));
//     }
// }
module.exports={vehicle_list}