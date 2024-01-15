import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const mailer: {
  transporter?: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
} = {};

export async function setupMailer() {
    const user = process.env.MAIL_USER_EMAIL as string;
    const password = process.env.MAIL_APP_PASSWORD as string;

    // Using gmail for simplicity, but this should be a custom SMTP server
    // Gmail isn't that "bot-friendly" so this needs additional gmail account configuration, please refer to the README.md file
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: password,
      },
    });

	mailer.transporter = transporter;
}
