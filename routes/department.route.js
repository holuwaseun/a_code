"use strict";

const _                                   = require(`lodash`);
const DepartmentModel                     = require(`../Model/department`);
const { authMiddleware, tokenMiddleware } = require(`../middleware/middleware`);

module.exports = (express, socket_io) => {
    const departmentRoute = express.Router();

    /*
    * CREATE department endpoint
    */
    departmentRoute.post("/create", (request, response, next) => {
        const departmentObj = {
            departmentName: request.body.departmentName,
            departmentCode: request.body.departmentCode
        };

        const department = new DepartmentModel(departmentObj);

        department.save((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Department created successfully",
                data: document
            });
        });
    });

    /*
    * RETRIEVE department endpoint
    */
    departmentRoute.get("/retrieve/:_id", (request, response, next) => {
        DepartmentModel.findOne({ _id: request.params._id, available: true }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Department data loaded",
                data: document
            });
        });
    });

    /*
    * RETRIEVE all departments endpoint
    */
    departmentRoute.get("/retrieve", (request, response, next) => {
        DepartmentModel.find({ available: true }).exec((err, documents) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Department data loaded",
                data: documents
            });
        });
    });


    /*
    * UPDATE department endpoint
    */
    departmentRoute.put("/update/:_id", (request, response, next) => {
        const _id = request.params._id;

        const departmentObj = {
            departmentName: request.body.departmentName,
            departmentCode: request.body.departmentCode,
            updatedAt: new Date()
        };

        DepartmentModel.findOneAndUpdate({ _id: _id, available: true }, departmentObj, { new: true }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Department updated successfully",
                data: document
            });
        });
    });

    /*
    * DELETE department endpoint
    */
    departmentRoute.delete("/delete/:_id", (request, response, next) => {
        const _id = request.params._id;

        DepartmentModel.findOneAndUpdate({ _id: _id, available: true }, { available: false, updatedAt: new Date() }, { new: true }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Department deleted successfully",
                data: document
            });
        });
    });

    return departmentRoute;
};