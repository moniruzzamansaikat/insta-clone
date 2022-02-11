const Post = require("../models/Post");
const User = require("../models/User");
const errors = require("restify-errors");
const rjwt = require("restify-jwt-community");
const config = require("../config");
const { uploadImage, deleteImage } = require("../utils");
const Notification = require("../models/Notification");

module.exports = (server) => {
  // get all posts
  server.get("/posts", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const limit = req.query.limit || 5;
    try {
      const posts = await Post.find({}, null, { sort: { created_at: -1 } })
        .limit(parseInt(limit))
        .populate("user")
        .populate({
          path: "comments.user",
          select: "username created_at _id",
          limit: 2,
        })
        .populate({ path: "likes", select: "username _id avatar" });

      res.json(posts);
      next();
    } catch (error) {
      next(new errors.RestError(error));
    }
  });

  // get post by id
  server.get("/posts/:id", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const { id } = req.params;

    try {
      const post = await Post.findById(id)
        .populate("user")
        .populate({
          path: "comments.user",
          select: "username created_at _id",
        })
        .populate({ path: "likes", select: "username _id avatar" });

      res.json(post);
      return next();
    } catch (error) {
      res.status(500);
      return next(error);
    }
  });

  // add new post
  server.post("/posts", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const { body, user, image } = req.body;

    try {
      const { publicId, url } = await uploadImage(image);
      let { _id } = await Post.create({
        body,
        user,
        photos: [{ url, publicId }],
      });

      await User.findByIdAndUpdate(user, {
        $push: { posts: _id },
      });
      const newPost = await Post.findById(_id).populate("user");
      res.json(newPost);
      return next();
    } catch (error) {
      console.log(error);
      return next(error);
    }
  });

  // delete post
  server.del("/posts", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const { id, publicId } = req.body;

    try {
      await deleteImage(publicId);
      const deleted = await Post.findOneAndRemove({ _id: id });
      res.send({ id: deleted._id });
      return next();
    } catch (error) {
      console.log(error);
      return next(error);
    }
  });

  // like post
  server.post("/posts/:id/likes", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.body.userId;

    try {
      await Post.findByIdAndUpdate(postId, {
        $push: {
          likes: userId,
        },
      });

      // make a notification if user not same
      if (user !== req.user._id) {
        await Notification.create({
          type: "like",
          user: req.user._id,
          userId,
          post: postId,
        });
      }

      const user = await User.findById(userId);

      res.json({ success: true, data: user });
      return next();
    } catch (error) {
      return next(error);
    }
  });

  // dislike post
  server.del("/posts/:id/likes", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.body.userId;

    try {
      await Post.findByIdAndUpdate(postId, {
        $pull: {
          likes: userId,
        },
      });

      const user = await User.findById(userId).select({ _id: 1, avatar: 1, username: 1 });
      res.json({ success: true, data: user });
      return next();
    } catch (error) {
      console.log(error);
      return next(error);
    }
  });

  // add comment
  server.post("/posts/:id/comments", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.body.userId;
    const text = req.body.text;

    try {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $push: {
            comments: {
              text,
              user: userId,
            },
          },
        },
        { new: true }
      ).populate("comments.user");

      // add notification if user is  not same
      if (userId !== req.user._id) {
        await Notification.create({
          type: "comment",
          user: userId,
          userId: req.user._id,
          post: postId,
        });
      }

      res.json({ success: true, data: post.comments });
      return next();
    } catch (error) {
      console.log(error);
      return next(error);
    }
  });
};
