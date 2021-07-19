const mongoose = require('mongoose');
const Student = require('../models/student');
module.exports = {
    // Get all course
    getAllStudents: function (req, res) {
        Student.find()
            .then((students) => {
                return res.status(200).json({
                    success: true,
                    message: 'A list of all students',
                    students: students,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    message: 'Server error. Please try again.',
                    error: err.message,
                });
            });
    },

    createStudent: function (req, res) {
        let data = req.body;
        const query = data._id ? {
            _id: data._id
        } : {
            _id: new mongoose.mongo.ObjectID()
        };
        const update = {
            $set: data
        };
        if (data._id) {
            Student.updateOne(query, update)
                .then((student) => {
                    return res.status(200).json({
                        success: true,
                        message: 'A new student was created!',
                        student: student,
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        success: false,
                        message: 'Server error. Please try again.',
                        error: err.message,
                    });
                });
        } else {
            Student.findOne({
                    studentID: Number(data.studentID)
                })
                .then(student => {
                    if (student) {
                        return res.status(200).json({
                            success: false,
                            message: 'Fail. StudentID is exists!',
                        });
                    } else {
                        Student.create(data)
                            .then((student) => {
                                return res.status(200).json({
                                    success: true,
                                    message: 'A new student was created!',
                                    student: student,
                                });
                            })
                            .catch((err) => {
                                res.status(500).json({
                                    success: false,
                                    message: 'Server error. Please try again.',
                                    error: err.message,
                                });
                            });
                    }
                })
        }
    },

    deleteStudent: function (req, res) {
        let {
            _id
        } = req.body;
        Student.findByIdAndRemove(_id)
            .exec()
            .then(() => {
                Student.find()
                    .then((students) => {
                        return res.status(200).json({
                            success: true,
                            message: 'A list of all students',
                            students: students,
                        });
                    })
            })
            .catch((err) => res.status(500).json({
                success: false,
            }));
    },
};