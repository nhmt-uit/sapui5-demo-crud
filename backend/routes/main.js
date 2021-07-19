const express = require('express');
const { getAllStudents, createStudent, deleteStudent } = require('../controllers/student');

const router = express.Router();
router.post('/getAllStudents', getAllStudents);
router.post('/createStudent', createStudent);
router.post('/deleteStudent', deleteStudent);

module.exports = router;