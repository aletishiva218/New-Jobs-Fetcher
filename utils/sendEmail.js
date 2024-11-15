const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail", // or your email provider
    auth: {
      user: process.env.USER,
      pass: process.env.USERPASS
    },
  });

const sendMail = (email,otp) => {
    const mailOptions = {
        from: "aletishiva218@gmail.com",
        to: email,
        subject: "Jobs Dashboard",
        text: "Please confirm your otp: "+otp.toString()
      };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });  
}

module.exports = sendMail;