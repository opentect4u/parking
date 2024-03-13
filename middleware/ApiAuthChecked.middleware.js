const { sendErrorResponce } = require("../utils/ResponceAssets");
const { verifyToken2 } = require("../utils/jwt.util");

const checkedToken = async (req, res, next) => {

    try {
        //const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
        const token = req.headers["x-access-token"] || req.headers["authorization"];
        const verifyTokenres = await verifyToken2(token)
        if (verifyTokenres!=0) {
            req.user = verifyTokenres.data.userdata.msg[0];
            next()
        }else{
            res.json(sendErrorResponce(null,"invalid token"))
        }
    } catch (error) {
        res.json(sendErrorResponce(error,"error data"));
    }
}





module.exports = {
    checkedToken
}