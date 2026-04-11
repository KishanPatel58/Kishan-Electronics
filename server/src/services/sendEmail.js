const transporter = require("../config/nodemailer");
const ENV = require("../config/config");

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: ENV.EMAIL_ID,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email error:", error);
  }
};

module.exports = sendEmail;