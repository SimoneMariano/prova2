const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    displayName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    photos: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", schema);
