const mongoose = require('mongoose'); // import mongoose

//create Post Schema
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

//export Post model
module.exports = mongoose.model('Post', postSchema);
