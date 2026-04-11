const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: null,
  },
  otpCreatedAt: {
    type: Date,
    default: null,
  },
  otpExpiresAt: {
    type: Date,
    default: null,
  },
  image: {
    type: String,
    default: "",
  },
});

const adminModel = mongoose.model("Admin", adminSchema);

module.exports = adminModel;
