const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//create User Schema
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //unique validator validates if the email is unique, using mongoose

//export User model
module.exports = mongoose.model('User', userSchema);
