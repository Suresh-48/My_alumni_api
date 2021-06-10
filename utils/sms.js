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

export const sendSms = (message, to) => {
  client.messages.create({
    body: message,
    from: authPhone,
    to: to,
  });
};
export const bulkSms = (message, numbers) => {
  Promise.all(
    numbers.map((number) => {
      client.messages.create({
        to: number,
        from: authPhone,
        body: message,
      });
    })
  )
    .then((messages) => {
      console.log("Messages sent!");
    })
    .catch((err) => console.error(err));
};
// export default { sendSms, bulkSms };
