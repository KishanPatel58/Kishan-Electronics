const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  reason: {
    type: String, // "logout" or "expired"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const blacklistModel = mongoose.model("Blacklist", blacklistSchema);
module.exports = blacklistModel;
