const mongoose = require("mongoose");
const timeStamp = require("mongoose-timestamps");

const NotificationSchema = new mongoose.Schema({
  type: String, // follow | comment | like
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  // reference user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // notification user
  userId: { type: String },
  seen: {
    type: Boolean,
    default: false,
  },
});

NotificationSchema.plugin(timeStamp);

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
