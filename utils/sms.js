import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
});
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

module.exports = {
  sendSms: (message, to) => {
    client.messages.create({
      body: "Hello",
      from: "+1 415 941-5932",
      to: "+919655345418",
    });
  },
};
