const Student = require('../Model/student.js')
const Config = require('./config/database.js')
const jsonwebtoken = require('jsonwebtoken')
const secret_key = Config.secret_key;
function createToken(user){
    const token = jsonwebtoken.sign(Student,secret_key, {
        expiresIn : 1234567
    })
    return token;
}