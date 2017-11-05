"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

let studentSchema = new Schema({
    _departmentId: { type: Schema.ObjectId, required: true, ref: "Department" },
    _levelId: { type: Schema.ObjectId, required: true, ref: "Level" },
    matricNumber: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true, minlength: [6, "The password is too short, minimum length is {MINLENGTH}"] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
});

studentSchema.pre("save", function(next) {
    let student = this
    if (!student.isModified("password")) {
        return next()
    }

    bcrypt.hash(student.password, null, null, function(err, hash) {
        if (err) {
            return next(err);
        }
        student.password = hash;
        next();
    });
});

studentSchema.methods.passwordCheck = function(password, callback) {
    let student = this;

    bcrypt.compare(password, student.password, (err, isMatch) => {
        if (err) return callback(err);

        callback(null, isMatch);
    });
}

module.exports = mongoose.model("Student", studentSchema);