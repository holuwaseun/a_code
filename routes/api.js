const Student = require('../Model/student.js')
const Config = require('../config/database.js')
const jsonwebtoken = require('jsonwebtoken')
const secret_key = Config.secret_key;
function createToken(user){
    const token = jsonwebtoken.sign(Student,secret_key, {
        expiresIn : 1234567
    })
    return token;
}

module.exports  = function(app, express,socket_io){
    let api = express.Router();
  // CREATE  Student Endpoint
      api.post("createStudent", (request, response) => {
        const studentObj = {
            fullName: request.body.fullName,
            email: request.body.email,
            userName: request.body.userName,
            password: request.body.password,
            institution: request.body.institution
        }
      }}