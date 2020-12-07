const express = require('express');

const app = express(); //execute express as a function and store in app

app.use((req, res, next) => {
  console.log('first middleware')
  next();
}); // .use to register new middleware

app.use((req, res, next) => {
  res.send('hello from express!'); //express response more powerful than simple nodejs
});

module.exports = app;
