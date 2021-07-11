import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId:'AKIAZHZVVPBDIYKFYF4M',
  secretAccessKey:'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',
  region: 'ap-south-1'
});

const sns = new AWS.SNS();

export default function sendSms(message,to_number){
  sns.publish({
    Message: `${message}`,
    Subject: 'Alumni',
    PhoneNumber:`${to_number}`},
    // (data,err)=>{
    //   if(data){
    //     console.log(data)
    //   }else{
    //     console.log(err)
    //   }
    // }
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
