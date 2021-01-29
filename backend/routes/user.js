const express = require("express");
const bcrypt = require("bcrypt"); // to encrypt user passwords
const jwt = require('jsonwebtoken');

const User = require("../models/user");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10) //hash the password for security
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User Created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user){ //if the user doesnt exist then no
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user; //to pass user for the next .then block
      return bcrypt.compare(req.body.password, user.password); //returns true if the password matches one in the DB
    })
    .then(result => {
      if (!result){
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign( //create a jsonwebtoken
        { email: fetchedUser.email, userId: fetchedUser._id },
         'secret_this_should_be_longer',
        { expiresIn: "1h"} // set token to expire in 1hr
        );
        res.status(200).json({
          token: token
        });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth Failed"
    })
  });
});

module.exports = router;
