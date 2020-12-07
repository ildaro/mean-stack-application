const express = require('express');
const { stringify } = require('querystring');

const app = express(); //execute express as a function and store in app

app.use("/api/posts",(req, res, next) => { //requests going to api/posts will reach this code
  const posts = [
    {id: "0dummyid", title: "dummy server side post 1", content: "some content from the server"},
    {id: "1dummyid", title: "dummy server side post 2", content: "some content from the server"}
  ];

  res.status(200).json({
    message:'Posts fetched successfully',
    posts: posts
  });
});

module.exports = app; //export the express to import in server.js
