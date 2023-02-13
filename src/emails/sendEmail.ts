import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

interface IOptions {
  email: string;
  message: string;
  subject: string;
}

const sendEmail = (options: IOptions) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const mailOptions = {
    from: "princeismail095@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendEmail;
