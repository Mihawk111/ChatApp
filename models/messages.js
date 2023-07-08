const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chat: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  image: String,
});

exports.Message = mongoose.model("messages", messageSchema);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: String,
});

exports.User = mongoose.model("users", userSchema);
