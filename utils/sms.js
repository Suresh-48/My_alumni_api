import AWS from "aws-sdk";

// Config
import { awsRegion, awsAccessKeyId, awsSecretAccessKey } from "../config.js";

// Load AWS Config
AWS.config.update({
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
  region: awsRegion || "ap-south-1",
});

console.log("awsRegion: ", awsRegion);

const snsMessage = new AWS.SNS();

/**
 * Send SMS
 *
 * @param {*} message
 * @param {*} to_number
 */
export default function sendSms(message, toNumber) {
  snsMessage.publish(
    {
      Message: `${message}`,
      Subject: "Alumni",
      PhoneNumber: `${toNumber}`,
    },
    (data, err) => {
      if (err) {
        console.log("Error : ", err);
      } else {
        console.log("Data : ", data);
      }
    }
  );
}

// export const bulkSms = (message, numbers) => {
//   Promise.all(
//     numbers.map((number) => {
//       client.messages.create({
//         to: number,
//         from: authPhone,
//         body: message,
//       });
//     })
//   )
//     .then((messages) => {
//       console.log("Messages sent!");
//     })
//     .catch((err) => console.error(err));
// };
// export default sendSms;
