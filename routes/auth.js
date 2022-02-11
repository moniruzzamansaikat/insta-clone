const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config");
const rjwt = require("restify-jwt-community");
const bcrypt = require("bcryptjs");

module.exports = (server) => {
  // register new user
  server.post("/auth/register", async (req, res, next) => {
    const { fullname, email, password, password_confirmation } = req.body;
    const beforeUser = await User.findOne({ email });

    if (beforeUser) {
      res.send({ success: false, message: "Email alredady registerd!" });
      return next();
    }

    if (password !== password_confirmation) {
      res.send({ success: false, message: "Passwords do not match!" });
      return next();
    }

    try {
      const user = await User.create({ fullname, email, password });
      res.json({ success: true });
      next();
    } catch (error) {
      next(error);
    }
  });

  // check for authe
  server.get("/auth/check", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    res.json({ success: true });
    next();
  });

  // login user
  server.post("/auth/login", async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.json({ message: "No user found!" });
        return next();
      }

      const valid = await user.validatePassword(password);
      if (valid) {
        const token = await jwt.sign(
          {
            _id: user._id,
          },
          config.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );
        res.send(token);
        return next();
      } else {
        res.json({ message: "Password did not match!" });
        return next();
      }
    } catch (error) {
      console.log(error);
      res.send(403);
    }
  });

  // change pwd
  server.put("/auth/password", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const { oldPassword, newPassword, passwordConfirmation } = req.body;

    const userId = req.user._id;
    const user = await User.findById(userId);
    const matchedOldPwd = await user.validatePassword(oldPassword);

    if (!matchedOldPwd) {
      res.status(400);
      res.send({ success: false, error: "Old password did not match!" });
      return next();
    }

    if (newPassword.length < 6) {
      res.status(400);
      res.send({ success: false, error: "Password must be at least 6 character long!" });
      return next();
    }

    if (newPassword !== passwordConfirmation) {
      res.status(400);
      res.send({ success: false, error: "Password do not match!" });
      return next();
    }

    // password matched - update on db
    user.password = newPassword;
    await user.save();
    res.json({ success: true, data: "Password updated successfully!" });
    next();
  });
};
