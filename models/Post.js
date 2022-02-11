const mongoose = require("mongoose");
const timeStamps = require("mongoose-timestamps");
const uniqueValidator = require("mongoose-unique-validator");

const PostSchema = new mongoose.Schema({
  body: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      text: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  photos: [
    {
      url: String,
      publicId: String,
    },
  ],
});

PostSchema.plugin(timeStamps);
PostSchema.plugin(uniqueValidator);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
