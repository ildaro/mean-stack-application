const { IfStmt } = require("@angular/compiler");
const express = require("express");
const multer = require("multer");
const { createShorthandPropertyAssignment } = require("typescript");

const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

//using multer to store images in backend/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid MIME type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    // tells multer how to store the images
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype]; //file extension
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host"); //construct a url to server
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    post.save().then((createdPost) => { //add post to the database
      res.status(201).json({
        message: "post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    });
  }
);

//edit posts
router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      //if req.file then a new file was uploaded
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then((result) => {
      console.log(result);
      if (result.nModified > 0) { //if the post as actually been updated
        res.status(200).json({ message: "update successful" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    });
  }
);

//requests going to api/posts will reach this code
router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize; //+ infront of the variable to make it numeric instead of string
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1)) //if im on page 2 i want to skip 10 posts for example
      .limit(pageSize); //narrow down the amount of posts needed
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "post not found." });
    }
  });
});

//delete posts
router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
    console.log(result);
    if (result.n > 0){
      res.status(200).json({ message: "Post deleted!" });
    } else {
      res.status(401).json({ message: "Not Authorized" });
    }
  });
});

module.exports = router;
