"use strict";

const _                                   = require(`lodash`);
const StudentModel                        = require(`../Model/student`);
const { authMiddleware, tokenMiddleware } = require(`../middleware/middleware`);

module.exports = (express, socket_io) => {
    const studentRoute = express.Router();
    
    /*
    * CREATE student endpoint
    */
    studentRoute.post("/create", (request, response, next) => {
        const studentObj = {
            _departmentId: request.body._departmentId,
            _levelId: request.body._levelId,
            matricNumber: request.body.matricNumber,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            userName: request.body.userName,
            password: request.body.password
        };

        StudentModel.find({ userName: studentObj.userName, available: true }).exec((err, documents) => {
            if (err) return next(err);

            if (documents && documents.length) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "The username specified is already taken, please try again"
                });
                return false;
            }

            const student = new StudentModel(studentObj);
            
            student.save((err, document) => {
                if (err) return next(err);
    
                response.status(200).send({
                    status: 200,
                    success: true,
                    message: "Student created successfully",
                    data: document
                });
            });
        });
    });

    /*
    * Authentication endpoint
    */
    studentRoute.post("/login", (request, response, next) => {
        const userObj = {
            userName: request.body.userName,
            password: request.body.password
        };
        
        StudentModel.findOne({ userName: userObj.userName, available: true }).exec((err, document) => {
            if (err) return next(err);

            if (!document) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "Invalid credentials, please try again"
                })
                return false;
            }
            
            document.passwordCheck(userObj.password, (err, isMatch) => {
                if (err) return next(err);

                if (!isMatch) {
                    response.status(200).send({
                        status: 200,
                        success: false,
                        message: "Invalid credentials, please try again"
                    })
                    return false;
                }

                const tokenObj = {
                    _id: document._id,
                    userName: document.userName,
                    firstName: document.firstName,
                    lastName: document.lastName
                };
    
                const token = tokenMiddleware(tokenObj);
    
                response.status(200).send({
                    status: 200,
                    success: true,
                    message: `Authentication complete`,
                    data: _.omit(document.toObject(), 'password'),
                    authenticationToken: token
                });
            });
        });
    });

    


    /*
    * RETRIEVE student endpoint
    */
    studentRoute.get("/retrieve/:_id", (request, response, next) => {
        StudentModel.findOne({ _id: request.params._id, available: true }).populate({
            path: '_departmentId _levelId',
            match: { available: true }
        }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Student data loaded",
                data: document
            });
        });
    });

    /*
    * RETRIEVE all students endpoint
    */
    studentRoute.get("/retrieve", (request, response, next) => {
        StudentModel.find({ available: true }).populate({
            path: '_departmentId _levelId',
            match: { available: true }
        }).exec((err, documents) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Student data loaded",
                data: documents
            });
        });
    });


    /*
    * UPDATE student endpoint
    */
    studentRoute.put("/update/:_id", (request, response, next) => {
        const _id = request.params._id;

        const studentObj = {
            _departmentId: request.body._departmentId,
            _levelId: request.body._levelId,
            matricNumber: request.body.matricNumber,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            updatedAt: new Date()
        };

        StudentModel.findOneAndUpdate({ _id: _id, available: true }, studentObj, { new: true }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Student updated successfully",
                data: document
            });
        });
    });

    /*
    * DELETE student endpoint
    */
    studentRoute.delete("/delete/:_id", (request, response, next) => {
        const _id = request.params._id;

        StudentModel.findOneAndUpdate({ _id: _id, available: true }, { available: false, updatedAt: new Date() }, { new: true }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Student deleted successfully",
                data: document
            });
        });
    });

    return studentRoute;
};