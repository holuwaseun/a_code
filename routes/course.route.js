"use strict";

const _                                   = require(`lodash`);
const CourseModel                         = require(`../Model/course`);
const { authMiddleware, tokenMiddleware } = require(`../middleware/middleware`);

module.exports = (express, socket_io) => {
    const courseRoute = express.Router();

    /*
    * CREATE course endpoint
    */
    courseRoute.post("/create", (request, response, next) => {
        const courseObj = {
            _departmentId: request.body._departmentId,
            _levelId: request.body._levelId,
            courseName: request.body.courseName,
            courseCode: request.body.courseCode
        };

        const course = new CourseModel(courseObj);

        course.save((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Course created successfully",
                data: document
            });
        });
    });

    /*
    * RETRIEVE course endpoint
    */
    courseRoute.get("/retrieve/:_id", (request, response, next) => {
        CourseModel.findOne({ _id: request.params._id, available: true }).populate({
            pathe: "_departmentId _levelId",
            match: { available: true }
        }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Course data loaded",
                data: document
            });
        });
    });

    /*
    * RETRIEVE all courses endpoint
    */
    courseRoute.get("/retrieve", (request, response, next) => {
        CourseModel.find({ available: true }).populate({
            pathe: "_departmentId _levelId",
            match: { available: true }
        }).exec((err, documents) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Course data loaded",
                data: documents
            });
        });
    });


    /*
    * UPDATE course endpoint
    */
    courseRoute.put("/update/:_id", (request, response, next) => {
        const _id = request.params._id;

        const courseObj = {
            _departmentId: request.body._departmentId,
            _levelId: request.body._levelId,
            courseName: request.body.courseName,
            courserCode: request.body.courseCode,
            updatedAt: new Date()
        };

        CourseModel.findOneAndUpdate({ _id: _id, available: true }, courseObj, { new: true }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Course updated successfully",
                data: document
            });
        });
    });

    /*
    * DELETE course endpoint
    */
    courseRoute.delete("/delete/:_id", (request, response, next) => {
        const _id = request.params._id;

        CourseModel.findOneAndUpdate({ _id: _id, available: true }, { available: false, updatedAt: new Date() }, { new: true }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Course deleted successfully",
                data: document
            });
        });
    });

    return courseRoute;
};