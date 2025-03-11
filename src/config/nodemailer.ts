import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'fannydaratos121@gmail.com',
    pass: 'hari4563122'
  }
});

export default transporter;
