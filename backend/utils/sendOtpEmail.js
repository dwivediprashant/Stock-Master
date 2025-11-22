const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } =
    process.env;

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
    console.warn(
      "Email environment variables are missing. OTP codes will be logged to the console instead of sent by email."
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  return transporter;
}

async function sendOtpEmail({ to, code }) {
  const emailTransporter = getTransporter();

  if (!emailTransporter) {
    console.log(`OTP for ${to}: ${code}`);
    return;
  }

  const from = process.env.EMAIL_FROM;

  await emailTransporter.sendMail({
    from,
    to,
    subject: "StockMaster Password Reset OTP",
    text: `Your OTP code is ${code}. It is valid for 10 minutes.`,
  });
}

module.exports = { sendOtpEmail };
