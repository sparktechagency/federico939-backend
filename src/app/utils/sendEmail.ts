import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string, subject: string) => {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: Number(config.email.port),
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  await transporter.sendMail({
    from: config.email.from, // sender address
    to, // list of receivers
    subject, // Subject line
    text: '', // plain text body
    html, // html body
  });
};

export const sendEmailToAdmin = async (
  data: { name: string; email: string },
  html: string,
) => {
  const { name, email } = data;

  const transporter = nodemailer.createTransport({
    host: config.email.host || 'smtp.gmail.com',
    port: Number(config.email.port) || 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  await transporter.sendMail({
    from: email,
    to: config.email.user, // Admin email address to receive visitor messages
    replyTo: email, // This makes it easy to reply directly to the visitor
    subject: `Spetra Mentas: Problem reported by ${name}`,
    html,
  });
};
