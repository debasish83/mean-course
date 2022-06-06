// use express for http request/response handling
const express = require('express');
const { ppid } = require('process');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const postsRoutes = require('./routes/posts');

const app = express();

mongoose.connect('mongodb+srv://mean-admin:iFiaNlLfVrckIwct@mean-course.kynzo.mongodb.net/mean-course?retryWrites=true&w=majority')
.then(() => {
  console.log('Connected to database!');
})
.catch(() => {
  console.log('Connection failed');
})

// most javascript function takes a function
// next will forward it to next middleware

//add this for cors handling port 4200 want to talk with port 3000
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
})

//valid json data will be parsed
//we can also do it to parse other kind of bodies like json, xml and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use("/api/posts", postsRoutes);

app.use((req, res, next) => {
  res.status(200).json({message: 'Hello from express'});
})

//we don't use export like angular
module.exports = app;
