"use strict";

const _                                   = require(`lodash`);
const StudentModel                        = require(`../Model/student`);
const { authMiddleware, tokenMiddleware } = require(`../middleware/middleware`);

module.exports = (express, socket_io) => {
    const userRoute = express.Router();

    /*
    * Authentication middleware
    */
    userRoute.use(authMiddleware);

    /*
    * CREATE student endpoint
    */
    userRoute.get("/me", (request, response, next) => {
        response.status(200).send({
            status: 200,
            success: true,
            message: "Student loaded successfully",
            data: request.student
        });
    });

    return userRoute;
};