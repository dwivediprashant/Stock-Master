// Mock email sender
const sendOtpEmail = async ({ to, code }) => {
  console.log("========================================");
  console.log(`[EMAIL SERVICE] Sending OTP to ${to}`);
  console.log(`[EMAIL SERVICE] OTP Code: ${code}`);
  console.log("========================================");
  // In a real app, use nodemailer or SendGrid here
  return Promise.resolve();
};

module.exports = { sendOtpEmail };
