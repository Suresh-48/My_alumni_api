import admin from "firebase-admin";

import serviceAccount from "../firebase.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (token, title, body) => {
  try {
    const Token = token;
    const imageUrl =
      "https://firebasestorage.googleapis.com/v0/b/push-notification-3db49.appspot.com/o/ic_launcher.png?alt=media&token=2e6d7a6f-2fe6-4b6b-a36a-13f19d876f78";
    await messaging().sendMulticast({
      Token,
      notification: {
        title,
        body,
        imageUrl,
      },
    });
    console.log("Message Send Successfully");
  } catch (err) {
    console.log("Something went wrong!");
  }
};
console.log("object");
console.log(`sendNotification`, sendNotification());
export default sendNotification;
