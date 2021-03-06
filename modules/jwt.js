const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecretKey = process.env.JWT_SECRET;
const messageCode = require('./message');

module.exports = {
    signToken : async (email) => {
        const result = jwt.sign({
                email : email,
            }, jwtSecretKey)

        return result;
    }, // 토큰 발급
    verifyToken : async(token) => {
        try {
            decoded = jwt.verify(token, jwtSecretKey);
        } 
        catch(err) {
            if (err.name === 'TokenExpiredError') {
                return messageCode.TOKEN_EXPIRED;
            } 
            else {
                return messageCode.UNAUTHORIZED; 
            }
        }
        return decoded.email;
    } //토큰 검사, 이메일 리턴
}