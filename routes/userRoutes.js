import { Router } from "express";
const router = Router();
import serviceAccount from "../firebase.js";
import admin from "firebase-admin";

import twilio from "twilio";

const accountSid = "ACa551b5a209f7b7165cf85d94dca610fb";
const authToken = "25c0133959c99b268d0957e3334cc74f";

const client = twilio(accountSid, authToken);
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// User Controller
import { deleteMe, getAllUsers, getUser, updateUser, deleteUser, getGroups } from "../controllers/userController.js";
// Auth Controller
import { login, signup, protect, restrictTo } from "./../controllers/authController.js";
//router.use(protect);
router.post("/login", login);
router.post("/signup", signup);

// Protect all routes after this middleware

router.delete("/deleteMe", deleteMe);

//firebase notifications
const tokens = [
  "ezVihy_qTtahS3QCQMmur1:APA91bHJ2_u7B_Wk7_G3Qm0mbNaKL8FUuJ2f-S2BbDs4Wh8UMjfCGCJOTvjCIVH3lADvPnh9l8A7ZmQg-lJ-PRGGHT3gpQIMMkpqCdYZNzzLNqfABineubxR0khSRVVlYaIZ46jk07tw",
  "ezVihy_qTtahS3QCQMmur1:APA91bHJ2_u7B_Wk7_G3Qm0mbNaKL8FUuJ2f-S2BbDs4Wh8UMjfCGCJOTvjCIVH3lADvPnh9l8A7ZmQg-lJ-PRGGHT3gpQIMMkpqCdYZNzzLNqfABineubxR0khSRVVlYaIZ46jk07tw",
  "eO2uMfS7Rveeiy_IFJOciQ:APA91bHYp6ivztOwn6-IoJi2jgRyUDoI0wR1LTxbU3pfidl7Bqm_jUDJ38wwUrkiwESVT6TAQV-uSqDPQhpPmt-TuOpGVZkIzG0wdUxffWj6ybRTpxSHqI-ekzAeUpSX79s83UKkpL8T",
];

router.post("/hello", async (req, res) => {
  try {
    console.log("*****FireBase Notification Process on Going*****");
    await admin.messaging().sendMulticast({
      tokens,
      notification: {
        title: "Basic Notification",
        body: "This is a basic Postman",
      },
    });
    res.status(200).json({ message: "Successfully sent notifications!" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Something went wrong!" });
  }
});

// Only admin have permission to access for the below APIs
// router.use(restrictTo('admin'));

router.route("/").get(getAllUsers);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

router.route("/:id/groups").get(getGroups);

router.post("/m", async (req, res) => {
  try {
    function digits(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const otp = digits(1000, 9999);
    // client.verify.services(accountSid).verificationChecks.create;
    client.messages
      .create({
        body: "Your Verification Code is " + otp,
        from: "+1 415 549 0167",
        to: "+917530061013",
      })
      .then((message) => console.log(message));
    res.status(200).json({ message: "Successfully sent notifications!", otp });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Something went wrong!" });
  }
});

export default router;
