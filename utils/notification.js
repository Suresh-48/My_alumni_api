import { initializeApp, credential as _credential, messaging } from "firebase-admin";

import serviceAccount from "../firebase.json";

initializeApp({
  credential: _credential.cert(serviceAccount),
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
    res.status(200).json({ message: "Successfully sent notifications!" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Something went wrong!" });
  }
};

export default sendNotification;
