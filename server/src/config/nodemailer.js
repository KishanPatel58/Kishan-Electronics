const nodemailer = require("nodemailer");
const ENV = require("./config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_ID,
    pass: ENV.GMAIL_APP_PASSWORD
  }
});

module.exports = transporter;