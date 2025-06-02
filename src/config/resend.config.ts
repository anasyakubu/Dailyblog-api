import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com', secure: true, port: 465,
  auth: { user: 'resend', pass: process.env.RESEND_API_KEY, },
});

export default transporter;