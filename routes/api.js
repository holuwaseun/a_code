"use strict";

const Student = require('../Model/student');
const Session = require('../Model/session');
const Config = require('../config/database.js');
const jsonwebtoken = require('jsonwebtoken');

const secret_key = Config.secret_key;

function createToken(student) {
    const token = jsonwebtoken.sign(student, secret_key, {
        expiresIn: 1234567
    });
    return token;
}

module.exports = function(app, express, socket_io) {
    let api = express.Router();

    // CREATE User Endpoint
    api.post("/student/create", (request, response) => {
        const studentObj = {
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            userName: request.body.userName,
            password: request.body.password,
            department: request.body.department
        };

        const student = new Student(studentObj);

        student.save((err, savedUser) => {
            if (err) {
                response.status(200).send({
                    status: 403,
                    success: false,
                    message: "Error occured",
                    error_message: err.message
                });
                return false;
            }

            response.status(200).send({
                status: 200,
                success: true,
                message: "Student created successfully",
                student_data: savedUser
            });
        });
    });

    //authentication or login endpoint

    api.post("/student/login", (request, response) => {
        const userObj = {
            userName: request.body.userName,
            password: request.body.password
        }
        console.log(userObj);
        let token_obj = {}
        Student.findOne({ userName: userObj.userName, available: true }, 'department userName password firstName', (err, student) => {
            if (err) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "An error occured, please try again",
                    error_message: err.message
                });
                return false;
            }

            if (!student) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "Student doesn't exist, please try again"
                })
            } else if (student) {
                let validPassword = student.passwordCheck(userObj.password)

                if (!validPassword) {
                    response.status(200).send({
                        status: 200,
                        success: false,
                        message: "Invalid credentials, please try again"
                    })
                } else {
                    token_obj = {
                        _id: student._id,
                        userName: student.userName,
                        firstName: student.firstName,
                        lastName: student.lastName,
                        department: student.department,
                        student_id: student._student_id
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
                            });
                            return false;
                        }

                        if (!session) {
                            let new_session = new Session({ student_logged: true, student_id: null })
                            new_session.save((err, savedSession) => {
                                if (err) {
                                    response.status(200).send({
                                        status: 200,
                                        success: false,
                                        message: "An error occured, please try again",
                                        error_message: err.message
                                    });
                                    return false;
                                }
                                response.status(200).json({
                                    status: 200,
                                    success: true,
                                    message: "Login was successful",
                                    token: student_token,
                                    data: student
                                });
                            });
                        } else {
                            session.student_logged = true;
                            session.save((err, savedSession) => {
                                if (err) {
                                    response.status(200).send({
                                        status: 200,
                                        success: false,
                                        message: "An error occured, please try again",
                                        error_message: err.message
                                    });
                                    return false;
                                }

                                response.status(200).json({
                                    status: 200,
                                    success: true,
                                    message: "Login was successful",
                                    token: student_token,
                                    data: student
                                });
                            });
                        }
                    });
                }
            }
        });
    });

    api.use((request, response, next) => {
        let token = request.body.token || request.query.token || request.headers['x-access-token']

        if (!token) {
            response.status(200).send({
                status: 403,
                success: false,
                message: "No valid student token found"
            });
            return false;
        } else {
            jsonwebtoken.verify(token, secret_key, (err, decoded) => {
                if (err) {
                    response.status(200).send({
                        status: 403,
                        success: false,
                        message: "Error occured",
                        error_message: err.message
                    });
                    return false;
                }

                request.decoded = decoded;

                next();
            });
        }
    });

    /**Retrieve student endpoint */

    api.get("/student", (request, response) => {
        let student = request.decoded
        Student.findOne({ _id: student._id, available: true }).populate({
            path: '_id',
            match: { available: true }
        }).exec((err, student) => {
            if (err) {
                response.status(200).send({
                    status: 403,
                    success: false,
                    message: "Error occured",
                    error_message: err.message
                });
                return false;
            }

            response.status(200).send({
                status: 200,
                success: true,
                message: "Student data loaded",
                student_data: student
            });
        });
    });

    /**Retrieve all students endpoint */
    api.get("/students", (request, response) => {
        let student = request.decoded;
        Student.find({ available: true }).exec((err, students) => {
            if (err) {
                response.status(200).send({
                    status: 403,
                    success: false,
                    message: "Error occured",
                    error_message: err.message
                });
                return false;
            }

            response.status(200).send({
                status: 200,
                success: true,
                message: "Student data loaded",
                student_data: students
            });
        });
    });


    /* Update Student Endpoint   */
    api.put("/api/update", (request, response) => {
        const _student_id = request.body._student_id;

        const studentObj = {
            firstName: request.body.firstName,
            lastName: request.bode.lastName
        };

        Student.findOne({ _id: _student_id, available: true }, (err, student) => {
            if (err) {
                response.status(200).send({
                    status: 403,
                    success: false,
                    message: "Error occured",
                    error_message: err.message
                });
                return false;
            }

            if (!student) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "Trying to edit a non-existing student"
                });
            } else {
                student.firstName = studentObj.firstName;
                student.lastName = studentObj.lastName;

                student.save((err, savedStudent) => {
                    if (err) {
                        response.status(200).send({
                            status: 403,
                            success: false,
                            message: "Error occured",
                            error_message: err.message
                        });
                        return false;
                    }

                    response.status(200).send({
                        status: 200,
                        success: true,
                        message: "Student updated successfully",
                        student_data: savedStudent
                    });
                });
            }
        });
    });

    /*Delete Student Endpoint*/
    api.delete("/api/delete", (request, response) => {
        const _student_id = request.body.student_id;

        Student.findOne({ _id: _student_id, available: true }, (err, student) => {
            if (err) {
                response.status(200).send({
                    status: 403,
                    success: false,
                    message: "Error occured",
                    error_message: err.message
                });
                return false;
            }

            if (!student) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "Trying to delete a non-existing student"
                });
            } else {
                student.available = false;

                student.save((err, savedStudent) => {
                    if (err) {
                        response.status(200).send({
                            status: 403,
                            success: false,
                            message: "Error occured",
                            error_message: err.message
                        });
                        return false;
                    }

                    User.update({ _id: savedStudent._user_id }, { $set: { available: false } }, (err) => {
                        if (err) {
                            response.status(200).send({
                                status: 403,
                                success: false,
                                message: "Error occured",
                                error_message: err.message
                            });
                            return false;
                        }

                        response.status(200).send({
                            status: 200,
                            success: true,
                            message: "Student deleted successfully"
                        });
                    });
                });
            }
        });
    });

    return api;
};