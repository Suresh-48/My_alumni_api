import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

client.messages.create({
  body: "Your Verification Code is " + "----",
  from: "+1 415 549 0167",
  to: req.body.phone,
});
