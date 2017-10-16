const Student = require('../Model/student')
const Session = require('../Model/session')
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
      api.post("/api/createStudent", (request, response) => {
        const studentObj = {
            firstName: request.body.firstName,
            email: request.body.email,
            userName: request.body.userName,
            password: request.body.password,
            lastName: request.body.lastName,
            department: request.body.department,
            level: request.body.level,
            courses: request.body.courses
        }
        console.log(studentObj);
        const student = new Student(studentObj)
        student.save((err, savedUser) => {
            if (err) {
                response.status(200).send({
                    status: 403,
                    success: false,
                    message: "Error occured",
                    error_message: err.message
                })
                return
            }
            response.status(200).send({
                status: 200,
                success: true,
                message: "Student added successfully",
                student_data: savedUser
            })

        })
    })

    //authentication or login endpoint

    api.post("/login", (request, response) => {
          const userObj = {
            userName: request.body.username,
            password: request.body.password,
            department: request.body.department
        }
        console.log(userObj);
        let token_obj = {}
        Student.findOne({ userName: userObj.userName, available: true, department:userObj.department }, 'department userName password fullName', (err, user) => {
            if (err) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "An error occured, please try again",
                    error_message: err.message
                });
                return
            }

            if (!student) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "Student doesn't exist, please try again"
                })
            } else if (student) {
                 let validPassword = user.passwordCheck(userObj.password)
            
                 if (!validPassword) {
                    response.status(200).send({
                        status: 200,
                        success: false,
                        message: "Invalid credentials, please try again"
                    })
                } else {
                    token_obj = {
                        _id: user._id,
                        username: student.userName,
                        firstName:student.firstName,
                        lastName: student.lastName,
                        department:student.department,
                    }
                
                    const student_token = createToken(token_obj);

                    //if (student.user_type === 'user') {
                        Session.findOne({}, (err, session) => {                                                
                            if (err) {
                                response.status(200).send({
                                    status: 200,
                                    success: false,
                                    message: "An error occured, please try again",
                                    error_message: err.message            
                                })                                                                                                       
                                return
                            }

                            if (!session) {
                                let new_session = new Session({ student_logged: true,student_id: null })
                                new_session.save((err, savedSession) => {
                                    if (err) {
                                        response.status(200).send({
                                            status: 200,
                                            success: false,
                                            message: "An error occured, please try again",
                                            error_message: err.message
                                        })
                                        return
                                    }
                                    response.status(200).json({
                                        status: 200,
                                        success: true,
                                        message: "Login was successful",
                                        token: student_token,
                                        data: student
                                    })
                                })
                            } else {
                                session.student_logged = true
                                session.save((err, savedSession) => {
                                    if (err) {
                                        response.status(200).send({
                                            status: 200,
                                            success: false,
                                            message: "An error occured, please try again",
                                            error_message: err.message
                                        })
                                        return
                                    }

                                    response.status(200).json({
                                        status: 200,
                                        success: true,
                                        message: "Login was successful",
                                        token: student_token,
                                        data: student
                                    })
                                })}})}}})})
                                                                                                                                                                                     

    return api;
             
}