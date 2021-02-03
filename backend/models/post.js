const mongoose = require('mongoose'); // import mongoose

//create Post Schema
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } //ref is which model this field refers to
});

//export Post model
module.exports = mongoose.model('Post', postSchema);
