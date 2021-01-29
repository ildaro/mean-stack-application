const express = require('express');
const path = require('path');
const { stringify } = require('querystring');
const bodyParser = require('body-parser');
const PropertiesReader = require('properties-reader');
const dbProperties = PropertiesReader('C:/Users/ildar/Documents/mean-stack-application-master/backend/db.properties');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

//username and password for db connection read from db.properties file
var name = dbProperties.get('db.user.name');
var password = dbProperties.get('db.password');

const app = express(); //execute express as a function and store in app

mongoose.connect("mongodb+srv://"+name+":"+password+"@cluster0.atept.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to the DB");
  })
  .catch(() => {
    console.log("Connection to DB failed.");
  });

app.use(bodyParser.json()); //express middleware for parsing json data
app.use("/images", express.static(path.join("backend/images"))); //any express targeting /images will be allowed to continue

//setting headers to solve CORS error
app.use((req, res, next)=> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS"); //which http verbs are allowed to be sent
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app; //export the express to import in server.js
