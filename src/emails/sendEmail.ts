import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

interface IOptions {
  email: string;
  message: string;
  subject: string;
}

const sendEmail = (options: IOptions) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b6fece9aa9a3cb",
      pass: "67fbea8b1e0381",
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
