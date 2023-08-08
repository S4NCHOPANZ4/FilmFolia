const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const path = require("path");
const router = express.Router();
const axios = require("axios");
const { promisify } = require("util");
const natural = require("natural");
const { isAuthenticated } = require("../middleware/auth.js");
const Comments = require("../model/comments.js");

//create-posts
router.post(
  "/create-post",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { comment, user, movie, createdAt } = req.body;
      const publish = await Comments.create({
        comment: comment,
        user: user,
        movie: movie,
        createdAt: createdAt,
      });
      const commentFromDB = await Comments.findById(publish._id);
      res.status(201).json({
        success: true,
        publish: commentFromDB,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
//get-one-post
router.post(
  "/get-one-post",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { id } = req.body;
      const foundPublish = await Comments.findOne({ _id: id });

      res.status(201).json({
        success: true,
        publish: foundPublish,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
//get-posts
router.post(
  "/get-posts",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { index } = req.body;
      const pageSize = 15;

      const skip = (index - 1) * pageSize;

      const data = await Comments.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      console.log(error.message);
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
//post-likes
router.post(
  "/interact-like",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { postId, like, user } = req.body;

      const foundPublish = await Comments.findOne({ _id: postId });
      if (!foundPublish) {
        return next(new ErrorHandler("notfound", 400));
      }

      const getLikeIndex = () => {
        if(foundPublish.interactions.likes.length <= 0){
          return -1;
        }
        for (let i = 0; i < foundPublish.interactions.likes.length; i++) {
          if (foundPublish.interactions.likes[i].user === user._id) {
            console.log(i);
            return i;
          }
        }
        return -1;
      };

      const index = getLikeIndex()
      if(index === -1){
        if(like){
          foundPublish.interactions.interactions_likes = foundPublish.interactions.interactions_likes + 1 
        }else{
          foundPublish.interactions.interactions_likes = foundPublish.interactions.interactions_likes - 1 
        }
        foundPublish.interactions.likes.push({
          clicked: true,
          like: like,
          user: user._id
        });
      }else{
        updateLikes(foundPublish.interactions.likes[index], foundPublish.interactions, like)
      }

      await saveChanges(foundPublish, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
//interact-comments
router.post(
  "/interact-comments",
  catchAsyncErrors(async (req, res, next) => {
    const saveChanges = async (post) => {
      const modifiedPost = await post.save();
      res.status(201).json({
        success: true,
        data: modifiedPost,
      });
    };

    try {
      const { postId, comment, userId, userName} = req.body;
      const foundPublish = await Comments.findOne({ _id: postId });

      foundPublish.interactions.comments = [
        ...foundPublish.interactions.comments,
        { comments: comment, userId: userId, userName: userName },
      ];
      saveChanges(foundPublish);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
//Secondary Coment
router.post(
  "/interact-sub-comments",
  catchAsyncErrors(async (req, res, next) => {
    const saveChanges = async (post, index) => {
      const modifiedPost = await post.save();
      res.status(201).json({
        success: true,
        data: modifiedPost,
        index: index,
      });
    };

    try {
      const { comment_id, like, user } = req.body;
      const subComment = await Comments.findOne({
        "interactions.comments._id": comment_id,
      });

      if (!subComment) {
        console.log("Comentario secundario no encontrado.");
        return;
      }

      const subCommentIndex = subComment.interactions.comments.findIndex(
        (comment) => comment._id.toString() === comment_id
      );

      if (subCommentIndex === -1) {
        console.log("Comentario secundario no encontrado en el arreglo.");
        return;
      }

      const comment = subComment.interactions.comments[subCommentIndex]
      const getLikeIndex = () => {
        if(comment.likes.length <= 0){
          return -1;
        }
        for (let i = 0; i < comment.likes.length; i++) {
          if (comment.likes[i].user === user._id) {
            return i;
          }
        }
        return -1;
      };
      const index = getLikeIndex()
      if(index === -1){
        if(like){
          comment.interactions_likes = comment.interactions_likes + 1 
        }else{
          comment.interactions_likes = comment.interactions_likes - 1 
        }
        comment.likes.push({
          clicked: true,
          like: like,
          user: user._id
        });
      }else{
        updateLikes(comment.likes[index], comment, like)
      }

      await saveChanges(subComment, subCommentIndex);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
//get-post-byMovie
router.post(
  "/get-movie-posts",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { index, movieId } = req.body;

      const pageSize = 15;

      const skip = (index - 1) * pageSize;

      const data = await Comments.find({ "movie.id": movieId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
//get-post-byUser
router.post(
  "/get-user-posts",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { index, userId } = req.body;

      const pageSize = 20;

      const skip = (index - 1) * pageSize;

      const data = await Comments.find({ "user._id": userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {}
  })
);

//Update Functions

const saveChanges = async (post, res) => {
  try {
    const modifiedPost = await post.save();
    res.status(201).json({
      success: true,
      data: modifiedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
};

const updateLikes = (interactions, counter ,like) => {

  if (interactions.clicked) {
    if (interactions.like && like) {
      interactions.clicked = false;
      interactions.like = false;
      counter.interactions_likes = counter.interactions_likes - 1;
    } else if (interactions.like && !like) {
      interactions.clicked = true;
      interactions.like = false;
      counter.interactions_likes = counter.interactions_likes - 2;
    } else if (!interactions.like && like) {
      interactions.clicked = true;
      interactions.like = true;
      counter.interactions_likes = counter.interactions_likes + 2;
    } else if (!interactions.like && !like) {
      interactions.clicked = false;
      interactions.like = false;
      counter.interactions_likes = counter.interactions_likes + 1;
    }
  } else if (!interactions.clicked) {
    if (like) {
      interactions.clicked = true;
      interactions.like = true;
      counter.interactions_likes = counter.interactions_likes + 1;
    } else if (!like) {
      interactions.clicked = true;
      interactions.like = false;
      counter.interactions_likes = counter.interactions_likes - 1;
    }
  }
};

module.exports = router;
