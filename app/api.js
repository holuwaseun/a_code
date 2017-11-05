"use strict";

module.exports = (app, express, socket_io) => {
    const api     = express.Router();
    const Student = require(`../routes/student.route`)(express, socket_io);
    const Department = require(`../routes/department.route`)(express, socket_io);
    const Level = require(`../routes/level.route`)(express, socket_io);
    const Course = require(`../routes/course.route`)(express, socket_io);

    api.use(`/students`, Student);

    api.use(`/departments`, Department);

    api.use(`/levels`, Level);

    api.use(`/courses`, Course);

    return api;
};