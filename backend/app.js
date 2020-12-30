const express = require('express');
const { stringify } = require('querystring');
const bodyParser = require('body-parser');
const PropertiesReader = require('properties-reader');
const dbProperties = PropertiesReader('C:/Users/ildar/Documents/mean-stack-application-master/backend/db.properties');
const mongoose = require('mongoose');

const Post = require('./models/post');

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

//setting headers to solve CORS error
app.use((req, res, next)=> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS"); //which http verbs are allowed to be sent
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save(); //adds post to the database
  res.status(201).json({
    message: "post added successfully"
  }); //status code for new resource was created and everything is ok
});

app.get("/api/posts",(req, res, next) => { //requests going to api/posts will reach this code
  Post.find().then(documents => {
      res.status(200).json({
        message:'Posts fetched successfully',
        posts: documents
    });
  });
});

//delete posts
app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result)
    res.status(200).json({message: 'Post deleted!'});
  })
});
module.exports = app; //export the express to import in server.js
