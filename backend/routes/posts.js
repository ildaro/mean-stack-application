const { IfStmt } = require("@angular/compiler");
const express = require("express");
const multer = require("multer");
const { createShorthandPropertyAssignment } = require("typescript");

const Post = require("../models/post");
const PostsController = require("../controllers/posts");
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
  "", checkAuth, multer({ storage: storage }).single("image"), PostsController.createPost);

//edit posts
router.put("/:id", checkAuth, multer({ storage: storage }).single("image"),PostsController.editPost);

//requests going to api/posts will reach this code
router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPostById);

//delete posts
router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
