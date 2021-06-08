import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  authPhone: process.env.TWILIO_ACCOUNT_PHONE,
});
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const authPhone = process.env.TWILIO_ACCOUNT_PHONE;

const client = twilio(accountSid, authToken);

const sendSms = (message, to) => {
  client.messages.create({
    body: message,
    from: authPhone,
    to: to,
  });
};

export default sendSms;
