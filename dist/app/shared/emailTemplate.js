"use strict";
// import { ICreateAccount, IResetPassword } from '../types/emailTemplate';
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplate = void 0;
const createAccount = (values) => {
    const data = {
        to: values.email,
        subject: 'Verify your SpectraMentis Account',
        html: `
      <body style="font-family: Arial, sans-serif; background-color: #ffffff; margin: 50px; padding: 20px; color: #000000;">
        <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #ffffff; border-radius: 10px; border: 1px solid #00000010;">

          <!-- Logo -->
          <img src="https://res.cloudinary.com/dphkhbunv/image/upload/v1763617412/Spectramentis_ksrqiu.webp" 
               alt="SpectraMentis Logo" 
               style="display: block; margin: 0 auto 25px; width:150px;" />

          <!-- Greeting -->
          <h2 style="font-size: 24px; margin-bottom: 20px; text-align:center; color:#000000;">
            Welcome, ${values.name}!
          </h2>

          <!-- Instructions -->
          <p style="font-size: 15px; line-height: 1.6; color:#000000; text-align:center;">
            Thanks for joining <strong>SpectraMentis</strong>.  
            Please verify your email to activate your account.
          </p>

          <!-- OTP -->
          <div style="text-align: center;">
            <p style="font-size: 15px; margin-top: 25px;">Your verification code:</p>

            <div style="
              background-color: #000000;
              width: 140px;
              padding: 12px;
              text-align: center;
              border-radius: 8px;
              color: #ffffff;
              font-size: 28px;
              letter-spacing: 3px;
              margin: 20px auto;
            ">
              ${values.otp}
            </div>

            <p style="font-size: 14px; color:#00000099;">This code expires in 3 minutes.</p>
          </div>

          <!-- Footer -->
          <p style="font-size: 12px; color:#00000080; text-align:center; margin-top: 30px;">
            If this wasn’t you, please ignore this email.
          </p>

          <p style="font-size: 12px; color:#00000080; text-align:center;">
            © ${new Date().getFullYear()} SpectraMentis. All rights reserved.
          </p>
        </div>
      </body>
    `,
    };
    return data;
};
const resetPassword = (values) => {
    const data = {
        to: values.email,
        subject: 'Reset your SpectraMentis Password',
        html: `
      <body style="font-family: Arial, sans-serif; background-color: #ffffff; margin: 50px; padding: 20px; color: #000000;">
        <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #ffffff; border-radius: 10px; border: 1px solid #00000010;">

          <!-- Logo -->
          <img src="https://res.cloudinary.com/dphkhbunv/image/upload/v1763617412/Spectramentis_ksrqiu.webp" 
               alt="SpectraMentis Logo" 
               style="display: block; margin: 0 auto 25px; width:150px;" />

          <div style="text-align: center;">

            <p style="font-size: 15px; line-height: 1.6; color:#000000;">
              Use the following code to reset your password:
            </p>

            <div style="
              background-color: #000000;
              width: 140px;
              padding: 12px;
              text-align: center;
              border-radius: 8px;
              color: #ffffff;
              font-size: 28px;
              letter-spacing: 3px;
              margin: 20px auto;
            ">
              ${values.otp}
            </div>

            <p style="font-size: 14px; color:#00000099;">
              This code is valid for 3 minutes.
            </p>
          </div>

          <p style="font-size: 12px; color:#00000080; text-align:center; margin-top: 30px;">
            If you didn’t request a password reset, you can ignore this message.
          </p>

          <p style="font-size: 12px; color:#00000080; text-align:center;">
            © ${new Date().getFullYear()} SpectraMentis. All rights reserved.
          </p>
        </div>
      </body>
    `,
    };
    return data;
};
exports.emailTemplate = {
    createAccount,
    resetPassword,
};
