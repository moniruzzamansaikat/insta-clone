const mongoose = require("mongoose");
const timeStamps = require("mongoose-timestamps");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  avatar: { publicId: String, url: String },
  username: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  bio: { type: String, default: "" },
  gender: { type: String, default: "" },
  dateOfBirth: { type: Date },
});

UserSchema.plugin(timeStamps);
UserSchema.plugin(uniqueValidator, { message: "{PATH} already exist!" });

UserSchema.pre("save", async function () {
  this.username = this.email.split("@")[0];
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
