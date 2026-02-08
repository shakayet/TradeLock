/* eslint-disable no-undef */
import path from 'path';
import { ICreateAccount, IResetPassword, IReminderEmail } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const logoPath = path.join(process.cwd(), 'src', 'assets', 'logo.png');
  const data = {
    to: values.email,
    subject: 'Verify your TradeLock account',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
        <style>
            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; color: #333; line-height: 1.6; }
            .container { width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            .header { background: #173616; padding: 32px; text-align: center; }
            .content { padding: 40px 30px; text-align: center; }
            .greeting { font-size: 24px; color: #173616; margin-bottom: 15px; font-weight: bold; }
            .message { font-size: 16px; color: #555; margin-bottom: 25px; }
            .otp-container { background-color: #f0fdf4; border: 1px dashed #166534; border-radius: 8px; padding: 24px; display: inline-block; margin: 20px 0; min-width: 200px; }
            .otp-code { font-size: 32px; font-weight: 700; color: #166534; letter-spacing: 6px; font-family: 'Courier New', monospace; }
            .expiry { font-size: 14px; color: #666; margin-top: 15px; }
            .footer { background-color: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eeeeee; }
            .footer a { color: #173616; text-decoration: none; font-weight: 600; }
            @media only screen and (max-width: 600px) {
                .container { margin: 15px; width: auto; }
                .content { padding: 30px 20px; }
                .otp-code { font-size: 26px; letter-spacing: 4px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                 <img src="cid:logo" alt="TradeLock" style="max-width: 180px; height: auto; display: block; margin: 0 auto;">
            </div>
            <div class="content">
                <div class="greeting">Hello, ${values.name}</div>
                <p class="message">Welcome to TradeLock! We're thrilled to have you here. Please verify your email address to unlock your account.</p>
                <div class="otp-container">
                    <div class="otp-code">${values.otp}</div>
                </div>
                <p class="expiry">This code expires in <strong>3 minutes</strong>.</p>
                <p style="font-size: 13px; color: #9ca3af; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px;">If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} TradeLock. All rights reserved.</p>
                <p><a href="#">Privacy Policy</a> • <a href="#">Support</a></p>
            </div>
        </div>
    </body>
    </html>
    `,
    attachments: [
      {
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo',
      },
    ],
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const logoPath = path.join(process.cwd(), 'src', 'assets', 'logo.png');
  const data = {
    to: values.email,
    subject: 'Reset your TradeLock password',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; color: #333; line-height: 1.6; }
            .container { width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            .header { background: #173616; padding: 32px; text-align: center; }
            .content { padding: 40px 30px; text-align: center; }
            .greeting { font-size: 24px; color: #173616; margin-bottom: 15px; font-weight: bold; }
            .message { font-size: 16px; color: #555; margin-bottom: 25px; }
            .otp-container { background-color: #fff1f2; border: 1px dashed #be123c; border-radius: 8px; padding: 24px; display: inline-block; margin: 20px 0; min-width: 200px; }
            .otp-code { font-size: 32px; font-weight: 700; color: #be123c; letter-spacing: 6px; font-family: 'Courier New', monospace; }
            .expiry { font-size: 14px; color: #666; margin-top: 15px; }
            .footer { background-color: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eeeeee; }
            .footer a { color: #173616; text-decoration: none; font-weight: 600; }
            @media only screen and (max-width: 600px) {
                .container { margin: 15px; width: auto; }
                .content { padding: 30px 20px; }
                .otp-code { font-size: 26px; letter-spacing: 4px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                 <img src="cid:logo" alt="TradeLock" style="max-width: 180px; height: auto; display: block; margin: 0 auto;">
            </div>
            <div class="content">
                <div class="greeting">Reset Password</div>
                <p class="message">We received a request to reset your TradeLock password. Enter the code below to proceed.</p>
                <div class="otp-container">
                    <div class="otp-code">${values.otp}</div>
                </div>
                <p class="expiry">This code expires in <strong>3 minutes</strong>.</p>
                <p style="font-size: 13px; color: #9ca3af; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px;">If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} TradeLock. All rights reserved.</p>
                <p><a href="#">Security</a> • <a href="#">Support</a></p>
            </div>
        </div>
    </body>
    </html>
    `,
    attachments: [
      {
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo',
      },
    ],
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
  reminderNotification: (values: IReminderEmail) => {
    const logoPath = path.join(process.cwd(), 'src', 'assets', 'logo.png');
    const data = {
      to: values.email,
      subject: `Reminder: ${values.title} starts in 30 minutes`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Upcoming Reminder</title>
          <style>
              body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; color: #333; line-height: 1.6; }
              .container { width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
              .header { background: #173616; padding: 32px; text-align: center; }
              .content { padding: 30px 24px; }
              .greeting { font-size: 20px; color: #173616; margin-bottom: 12px; font-weight: bold; }
              .title { font-size: 18px; color: #111827; margin: 8px 0; font-weight: 600; }
              .detail { font-size: 15px; color: #374151; margin: 6px 0; }
              .box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
              .footer { background-color: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eeeeee; }
              .footer a { color: #173616; text-decoration: none; font-weight: 600; }
              @media only screen and (max-width: 600px) {
                  .container { margin: 15px; width: auto; }
                  .content { padding: 24px 18px; }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                   <img src="cid:logo" alt="TradeLock" style="max-width: 180px; height: auto; display: block; margin: 0 auto;">
              </div>
              <div class="content">
                  <div class="greeting">Hello${values.name ? `, ${values.name}` : ''}</div>
                  <div class="title">Your reminder starts soon</div>
                  <div class="box">
                    <p class="detail"><strong>Title:</strong> ${values.title}</p>
                    <p class="detail"><strong>Start Time:</strong> ${values.startAtLocal}${
                      values.timezone ? ` (${values.timezone})` : ''
                    }</p>
                    ${
                      values.description
                        ? `<p class="detail"><strong>Details:</strong> ${values.description}</p>`
                        : ''
                    }
                    <p class="detail">This is your 30-minute reminder.</p>
                  </div>
                  <p style="font-size: 13px; color: #9ca3af; margin-top: 10px;">If you didn't set this reminder, you can ignore this email.</p>
              </div>
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} TradeLock. All rights reserved.</p>
                  <p><a href="#">Privacy Policy</a> • <a href="#">Support</a></p>
              </div>
          </div>
      </body>
      </html>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo',
        },
      ],
    };
    return data;
  },
};
