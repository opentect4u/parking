const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const verifyToken = (token) => jwt.verify(token, jwtConfig.secret);

const verifyToken2 = (token) => {
   return jwt.verify(token, jwtConfig.secret, (err, user) => {
        return err?0:{data:user};
    })
}

const createToken = (data) => jwt.sign(data, jwtConfig.secret, { expiresIn: jwtConfig.ttl });

module.exports = { verifyToken, verifyToken2, createToken } 