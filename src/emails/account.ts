import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config(); // Had and error "API key does not start with "SG." without setting dotenv.config() in this file

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

class Mail {
  public welcomeEmail(name: string, email: string) {
    sgMail.send({
      to: email,
      from: "princeismail095@gmail.com",
      subject: "Thanks for joining in!",
      text: `Welcome to SOT app, ${name}. Let me know how you get along with the app`,
    });
  }

  public cancelationEmail(name: string, email: string) {
    sgMail.send({
      to: email,
      from: "princeismail095@gmail.com",
      subject: "Sorry to see you go!",
      text: `Goodbye ${name}. I hope to see you sometime soon`,
    });
  }
}

const Email = new Mail();
export default Email;
