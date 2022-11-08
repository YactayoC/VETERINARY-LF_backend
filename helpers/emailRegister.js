const { createTransport } = require('nodemailer');

const emailRegister = async ({ email, fullname, token }) => {
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: 'LoyalFriend',
    to: email,
    subject: 'Check your LF account',
    text: 'Check your LF account',
    html: `<p>Hello: ${fullname}, check your Loyal Friend account.</p>
            <p>Your account is ready, you only have to check it in the following link: <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Check account</a> </p>
            <p>If you didn't create this account, you can ignore this message</p>
        `,
  });

  console.log('Email send: %s', info.messageId);
};

module.exports = { emailRegister };
