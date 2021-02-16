const { IfStmt } = require("@angular/compiler");
const express = require("express");
const { createShorthandPropertyAssignment } = require("typescript");

const Post = require("../models/post");
const PostsController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const router = express.Router();



router.post(
  "", checkAuth, extractFile, PostsController.createPost);

//edit posts
router.put("/:id", checkAuth, extractFile, PostsController.editPost);

//requests going to api/posts will reach this code
router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPostById);

//delete posts
router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
