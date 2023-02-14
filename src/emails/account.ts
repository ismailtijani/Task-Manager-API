import sgMail, { MailDataRequired } from "@sendgrid/mail";
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
  const message: MailDataRequired = {
    to: email,
    from: "princeismail095@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to SOT app, ${name}. Let me know how you get along with the app`,
  };
  try {
    Logging.info("Sending Welcome Email...");
    const res = await sgMail.send(message);
    Logging.info(res);
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
  const message: MailDataRequired = {
    to: email,
    from: "princeismail095@gmail.com",
    subject: "Sorry to see you go!",
    text: `Goodbye ${name}. I hope to see you sometime soon`,
  };
  try {
    Logging.info("Sending Goodbye Email...");
    await sgMail.send(message);
  } catch (error: any) {
    if (error.response) {
      Logging.error(error.response.body);
    }
    next(error);
  }
};
