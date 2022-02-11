const config = require("../config");
const rjwt = require("restify-jwt-community");
const Notification = require("../models/Notification");

module.exports = (server) => {
  // get current users's all notifications
  server.get("/notifications/:id", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const notifications = await Notification.find({ userId: String(req.user._id) })
      .populate({
        path: "user",
        select: "_id username",
      })
      .populate({
        path: "post",
        select: "_id",
      });

    res.json(notifications);
  });

  // seen notification
  server.post("/notifications/:id", rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    const id = req.params.id;
    const notification = await Notification.findByIdAndUpdate(
      id,
      {
        $set: {
          seen: true,
        },
      },
      {
        new: true,
      }
    );

    res.json(notification);
  });
};
