import User from "../models/userModel.js";
import Group from "../models/groupModel.js";
// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
import groupMembers from "../models/groupMembersModel.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
export async function deleteMe(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      active: false,
    });
    res.status(204).json({
      status: "Updated Successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}
export async function getGroups(req, res, next) {
  try {
    //User id
    const userId = req.params.id;
    const data = await groupMembers
      .find({
        userId: userId,
        status: "approved",
      })
      .populate("groupId");
    res.status(200).json({
      status: "Users Group Displayed ",
      data,
    });
  } catch (error) {
    next(error);
  }
}
export async function updateAvatar(req, res, next) {
  const userId = req.params.id;
  const file = req.body.avatar;
  const USER_PATH = "media/users";
  const type = file && file.split(";")[0].split("/")[1];
  const random = new Date().getTime();
  const fileName = `${userId}-${random}.${type}`;
  const filePath = `${USER_PATH}/${fileName}`;
  const userDetails = await User.findById(userId);
  if (!userDetails) {
    return next(new Error("User not found"));
  }
  // Upload file
  uploadBase64File(file, filePath, (err, mediaPath) => {
    if (err) {
      return callback(err);
    }
    User.updateOne(
      { _id: userId }, // Filter
      { avatar: mediaPath, avatarUrl: getPublicImagUrl(mediaPath) } // Update
    )
      .then((obj) => {
        res.status(200).json({
          status: "User profile updated successfully",
          data: {
            userDetails,
          },
        });
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  });
}
export async function deleteAvatarImage(req, res, next) {
  try {
    const userId = req.params.id;
    const data = User.findByIdAndUpdate(
      { _id: userId }, // Filter
      { avatarUrl: null, avatar: null } // Update
    ).then((obj) => {
      res.status(200).json({
        status: "User profile updated successfully",
        data: {
          data,
        },
      });
    });
  } catch (error) {
    next(error);
  }
}
export async function checkingUser(req, res, next) {
  try {
    const phone = req.body.phone;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const role = req.body.role;
    const exist = await User.find({ phone: phone });
    if (exist.length === 0) {
      //const otp = getRandomNumberForOtp(1000, 9999);
      const otp = "1234";
      //create new user
      const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        role: role,
        otp: otp,
      });
      const token = Math.floor(Date.now());
      user.password = undefined;
      //  sendSms(`Your Verification Code is ${otp}`, req.body.phone);
      res.status(201).json({
        status: "New User",
        message: "User signuped successfully",
        token,
        data: {
          user,
        },
      });
    } else {
      if (exist[0].active === false) {
        //const otp = getRandomNumberForOtp(1000, 9999);
        const otp = "1234";
        const user = await User.findOne({ phone: phone });
        const token = Math.floor(Date.now());
        user.password = undefined;
        //Otp Generation
        //  sendSms(`Your Verification Code is ${otp}`, req.body.phone);
        res.status(200).json({
          status: "User invited profile ",
          message: "User signuped successfully",
          token,
          data: {
            user,
          },
        });
      } else {
        res.status(200).json({
          status: "Already Existing User",
        });
      }
    }
  } catch (error) {
    next(error);
  }
}
export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
