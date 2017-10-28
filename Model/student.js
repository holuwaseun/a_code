"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    _student_id :{type: Number, required: true},
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true, select: false, minlength: [6, "The password is too short, minimum length is {MINLENGTH}"] },
    date_joined: { type: Date, default: Date.now },
    //institution:{type: String,required:false},
    department: { type: String, required: true },
    courses_registered: { type: Array, required: false },
    //level: {type: Number,required: false},     
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

studentSchema.methods.passwordCheck = function(password) {
    let student = this;

    return bcrypt.compareSync(password, student.password);
}

module.exports = mongoose.model("Student", studentSchema);