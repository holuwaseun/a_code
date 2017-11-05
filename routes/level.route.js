"use strict";

const _                                   = require(`lodash`);
const LevelModel                          = require(`../Model/level`);
const { authMiddleware, tokenMiddleware } = require(`../middleware/middleware`);

module.exports = (express, socket_io) => {
    const levelRoute = express.Router();

    /*
    * CREATE level endpoint
    */
    levelRoute.post("/create", (request, response, next) => {
        const levelObj = {
            levelName: request.body.levelName
        };

        const level = new LevelModel(levelObj);

        level.save((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Level created successfully",
                data: document
            });
        });
    });

    /*
    * RETRIEVE level endpoint
    */
    levelRoute.get("/retrieve/:_id", (request, response, next) => {
        LevelModel.findOne({ _id: request.params._id, available: true }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Level data loaded",
                data: document
            });
        });
    });

    /*
    * RETRIEVE all levels endpoint
    */
    levelRoute.get("/retrieve", (request, response, next) => {
        LevelModel.find({ available: true }).exec((err, documents) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Level data loaded",
                data: documents
            });
        });
    });


    /*
    * UPDATE level endpoint
    */
    levelRoute.put("/update/:_id", (request, response, next) => {
        const _id = request.params._id;

        const levelObj = {
            levelName: request.body.levelName,
            updatedAt: new Date()
        };

        LevelModel.findOneAndUpdate({ _id: _id, available: true }, levelObj, { new: true }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Level updated successfully",
                data: document
            });
        });
    });

    /*
    * DELETE level endpoint
    */
    levelRoute.delete("/delete/:_id", (request, response, next) => {
        const _id = request.params._id;

        LevelModel.findOneAndUpdate({ _id: _id, available: true }, { available: false, updatedAt: new Date() }, { new: true }).exec((err, document) => {
            if (err) return next(err);

            response.status(200).send({
                status: 200,
                success: true,
                message: "Level deleted successfully",
                data: document
            });
        });
    });

    return levelRoute;
};