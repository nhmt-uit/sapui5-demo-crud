const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const studentSchema = new mongoose.Schema({
    studentID: { type: Number, require: true, default: -1},
    firstName: { type: String, required: true, default: ''},
    lastName: { type: String, required: true, default: ''},
    age: { type: Number, required: true},
    sex: { type: String, required: true, default: ''},
    major: { type: String, required: true, default: ''},
});

module.exports = mongoose.model('Student', studentSchema);