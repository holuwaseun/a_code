const mongoose = require('mongoose')

let Schema = mongoose.Schema

const SessionSchema = new Schema({
    student_logged: { type: Boolean, default: false },
    student_id: { type: Schema.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Session", SessionSchema);