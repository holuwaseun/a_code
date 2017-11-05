"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    _departmentId: { type: Schema.ObjectId, required: true, ref: "Department" },
    _levelId: { type: Schema.ObjectId, required: true, ref: "Level" },
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
});

module.exports = mongoose.model("Course", courseSchema);