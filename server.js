const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
var cors = require('cors')
const mainRoutes = require("./backend/routes/main.js");

// set up dependencies
const app = express();
app.use(cors()) // Use this after the variable declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(logger('dev'));

// setup route
app.use('/api/', mainRoutes);

// set up mongoose
mongoose.connect('mongodb://localhost:27017/management_students', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((a) => {
    mongoose.connection.db.listCollections({
        name: 'students'
      })
      .next(function (err, collection_info) {
        // Check if collection does not exist
        if (!collection_info) {
          createDB();
        }
      });
    console.log('Database connected');
  })
  .catch((error) => {
    console.log("Error nè: ", error);
    console.log('Error connecting to database');
  });

// set up port
const port = 5005;
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to My Project with Nodejs Express Sapui5 and MongoDB',
  });
});
app.listen(port, () => {
  console.log(`Our server is running on port ${port}`);
});

// Create new DB if DB not exists;
var createDB = function () {
  var students = [{
      "studentID": 1,
      "firstName": "Tu",
      "lastName": "Nguyen",
      "age": 20,
      "sex": "M",
      "major": "Information Technology"
    },
    {
      "studentID": 2,
      "firstName": "Quynh",
      "lastName": "Tran",
      "age": 22,
      "sex": "F",
      "major": "Marketing"
    },
    {
      "studentID": 3,
      "firstName": "Thao",
      "lastName": "Huynh",
      "age": 21,
      "sex": "F",
      "major": "International Relationship"
    }];

  mongoose.connection.db.collection('students', function (err, collection) {
    collection.insert(students, {
      safe: true
    }, function (err, result) {});
  });
}