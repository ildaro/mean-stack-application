const bcrypt = require("bcrypt"); // to encrypt user passwords
const jwt = require('jsonwebtoken');

const User = require("../models/user");

exports.createUser = (req, res, next) => {
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
              message:"Invalid authentication credentials!"
            }
          );
        });
    });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user){ //if the user doesnt exist then no
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user; //to pass user for the next .then block
      return bcrypt.compare(req.body.password, user.password); //returns true if the password matches the user's in the DB
    })
    .then(result => {
      if (!result){
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign( //create a jsonwebtoken
        { email: fetchedUser.email, userId: fetchedUser._id },
         process.env.JWT_KEY,
        { expiresIn: "1h"} // set token to expire in 1hr
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,  //duration in seconds until token expires
          userId: fetchedUser._id
        });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid login credentials"
    })
  });
}
