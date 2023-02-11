import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { NextFunction } from "express";
import Logging from "../library/loggings";

dotenv.config(); // Had and error "API key does not start with "SG." without setting dotenv.config() in this file

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const welcomeEmail = async (
  email: string,
  name: string,
  next: NextFunction
) => {
  const message = {
    to: email,
    from: "princeismail095@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to SOT app, ${name}. Let me know how you get along with the app`,
  };
  try {
    Logging.info("Sending Welcome Email...");
    await sgMail.send(message);
  } catch (error: any) {
    if (error.response) {
      Logging.error(error.response.body);
    }
    next(error);
  }
};

export const cancelationEmail = async (
  email: string,
  name: string,
  next: NextFunction
) => {
  const message = {
    to: email,
    from: "princeismail095@gmail.com",
    subject: "Sorry to see you go!",
    text: `Goodbye ${name}. I hope to see you sometime soon`,
  };
  try {
    Logging.info("Sending Welcome Email...");
    await sgMail.send(message);
  } catch (error: any) {
    if (error.response) {
      Logging.error(error.response.body);
    }
    next(error);
  }
};

// class Email {
//   // public welcomeEmail(name: string, email: string) {
//   //   sgMail.send({
//   //     to: email,
//   //     from: "princeismail095@gmail.com",
//   //     subject: "Thanks for joining in!",
//   //     text: `Welcome to SOT app, ${name}. Let me know how you get along with the app`,
//   //   });
//   // }

//   // public cancelationEmail(name: string, email: string) {
//   //   sgMail.send({
//   //     to: email,
//   //     from: "princeismail095@gmail.com",
//   //     subject: "Sorry to see you go!",
//   //     text: `Goodbye ${name}. I hope to see you sometime soon`,
//   //   });
//   // }
//   private email;
//   private name;

//   constructor(email: string, name: string) {
//     this.email = email;
//     this.name = name;
//   }
//   public welcomeEmail = async (next: NextFunction) => {
//     const message = {
//       to: this.email,
//       from: "princeismail095@gmail.com",
//       subject: "Thanks for joining in!",
//       text: `Welcome to SOT app, ${this.name}. Let me know how you get along with the app`,
//     };
//     try {
//       Logging.info("Sending Welcome Email...");
//       await sgMail.send(message);
//     } catch (error: any) {
//       if (error.response) {
//         Logging.error(error.response.body);
//       }
//       next(error);
//     }
//   };
// }

// export default Email;
