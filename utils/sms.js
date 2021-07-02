import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId:'AKIAQXIOLTJT4UQCVIFV',
  secretAccessKey:'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',
  region: 'ap-south-1'
});

const sns = new AWS.SNS();

export default function sendSms(message,to_number){
  sns.publish({
    Message: `${message}`,
    Subject: 'Alumni',
    PhoneNumber:`${to_number}`},
    (err,result)=>{
      console.log("Log Message",err,result);
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
// export default { sendSms, bulkSms };
