const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  content: {
    type: Text,
  },
  photos: [
    {
      type: String,
    },
  ],
  like: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("post", schema);
