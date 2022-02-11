const User = require("../models/User");
const Post = require("../models/Post");
const rjwt = require("restify-jwt-community");
const config = require("../config");
const { uploadImage, deleteImage } = require("../utils");
const Notification = require("../models/Notification");

module.exports = (server) => {
  // get all users excluding current
  server.get("/users", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const users = await User.find({ _id: { $ne: req.user._id }, followers: { $nin: req.user._id } });

    if (users) {
      res.json(users);
      return next();
    }

    res.json({
      success: false,
    });
    return next();
  });

  // get current user
  server.get("/users/current", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("posts").exec();
    if (user) {
      res.json({
        success: true,
        data: user,
      });
      return next();
    }

    res.json({
      success: false,
    });
    return next();
  });

  // get user by id
  server.get("/users/:id", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const user = await User.findById(req.params.id).populate("posts").exec();
    if (user) {
      res.json({
        success: true,
        data: user,
      });
      return next();
    }

    res.json({
      success: false,
    });
    return next();
  });

  // delete user by id
  server.del("/users/:id", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const { id } = req.params;

    try {
      const deleted = await User.findByIdAndRemove(id);
      await Post.deleteMany({ user: id });

      res.json({ success: true });
      return next();
    } catch (error) {
      res.json({ success: false, message: "Something went wrong!" });
      return next();
    }
  });

  // get suggestions for current user
  server.get("/suggestion", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const users = await User.find({ _id: { $ne: req.user._id }, followers: { $nin: req.user._id } }).limit(5);

    if (users) {
      res.json({
        success: true,
        data: users,
      });
      return next();
    }

    res.json({
      success: false,
    });
    return next();
  });

  // get all followers
  server.get("/users/:id/followers", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const { id } = req.params;
    const { followers } = await User.findById(id).populate("followers");

    if (followers) {
      res.json({ success: true, data: followers });
      return next();
    }

    res.json({ succcess: false });
  });

  // get all following
  server.get("/users/:id/following", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const { id } = req.params;
    const { following } = await User.findById(id).populate("following");

    if (following) {
      res.json({ success: true, data: following });
      return next();
    }

    res.json({ succcess: false });
  });

  // update info
  server.put("/users/update_info", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const { email, username, bio, gender, dateOfBirth } = req.body;
    const userId = req.user._id;

    const duplicateUser = await User.findOne({ username });

    if (duplicateUser && duplicateUser._id === userId) {
      res.json({
        success: false,
        error: "Username already exists !",
      });
      return next();
    }

    const user = await User.findByIdAndUpdate(userId, {
      $set: {
        bio,
        gender,
        email,
        username,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  });

  // Update Profile Avater
  server.put("/users/update_avatar", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const { file, userId } = req.body;
    const foundUser = await User.findById(userId);

    if (foundUser.avatar.publicId) {
      await deleteImage(foundUser.avatar.publicId);
    }

    const { publicId, url } = await uploadImage(file, "ProfileImages");
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatar: {
            url,
            publicId,
          },
        },
      },
      { new: true }
    );

    const user = await User.findById(userId).populate("posts");

    res.json({
      user,
    });
  });

  // follow people
  server.post("/users/:id/followers", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.body;

    await User.findByIdAndUpdate(id, {
      $push: { following: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $push: { followers: id },
    });

    // create notification
    await Notification.create({
      type: "follow",
      userId,
      user: id,
    });

    res.json({ success: true });
    return next();
  });

  // unfollow
  server.del("/users/:id/followers", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.body;

    await User.findByIdAndUpdate(id, {
      $pull: { following: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { followers: id },
    });

    res.json({ success: true });
    return next();
  });
};
