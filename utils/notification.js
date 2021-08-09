import admin from "firebase-admin";

import serviceAccount from "../firebase.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (token, body) => {
  try {
    const title = "Alumni";
    await messaging().sendMulticast({
      token,
      notification: {
        title,
        body,
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
