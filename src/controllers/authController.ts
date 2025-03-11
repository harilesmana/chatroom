import bcrypt from "bcryptjs";
import prisma from '../models/userModel';
import nodemailer from '../config/nodemailer';
import crypto from 'crypto';
import { Context } from 'hono';

export const register = async (c: Context) => {
  const { username, password, email } = await c.req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = crypto.randomBytes(20).toString('hex');
  
  const user = await prisma.create({
    data: { username, password: hashedPassword, email, verificationCode },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Account Verification',
    text: `Please verify your account by clicking the following link: http://localhost:3000/auth/verify/${verificationCode}`
  };

  nodemailer.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return c.text('Failed to send verification email', 500);
    }
    console.log('Verification email sent: ' + info.response);
  });

  return c.redirect('/login');
};

export const verify = async (c: Context) => {
  const verificationCode = c.req.param('verificationCode');
  const user = await prisma.findUnique({ where: { verificationCode } });

  if (!user) {
    return c.text('Invalid verification code', 400);
  }

  await prisma.update({
    where: { id: user.id },
    data: { isVerified: true, verificationCode: null }
  });

  return c.text('Account verified. You can now log in.');
};

export const login = async (c: Context) => {
  const { username, password } = await c.req.json();
  const user = await prisma.findUnique({ where: { username } });

  if (user && await bcrypt.compare(password, user.password)) {
    if (!user.isVerified) {
      return c.text('Please verify your account first.', 401);
    }

    c.req.session.userId = user.id;
    return c.redirect('/chat');
  } else {
    return c.redirect('/login');
  }
};
