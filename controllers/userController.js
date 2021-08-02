import User from "../models/userModel.js";
import Group from "../models/groupModel.js";

// Base Controller
import sendSms from "../utils/sms.js";
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
import groupMembers from "../models/groupMembersModel.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";
import getRandomNumberForOtp from "../utils/otp.js";
import { environments, PRODUCTION_ENV } from "../config.js";

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
    const { phone, firstName, lastName, email, role } = req.body;

    const exist = await User.find({ phone: phone });

    if (exist.length === 0) {
      const otp = environments === PRODUCTION_ENV ? getRandomNumberForOtp(1000, 9999) : "1234";

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
      if (environments === PRODUCTION_ENV) {
        sendSms(`Your Verification Code is ${otp}`, phone);
      }

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
        const otp = environments === PRODUCTION_ENV ? getRandomNumberForOtp(1000, 9999) : "1234";

        const user = await User.findOne({ phone: phone });
        const token = Math.floor(Date.now());
        user.password = undefined;

        // Otp Generation
        if (environments === PRODUCTION_ENV) {
          sendSms(`Your Verification Code is ${user.otp}`, phone);
        }

        await User.findByIdAndUpdate(user._id, {
          otp: otp,
        });

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

export async function admin(req, res, next) {
  try {
    const { firstName, lastName, email, phone, schoolId, collegeId } = req.body;
    const userCheck = await User.find({ phone: phone });
    const data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      adminStatus: "pending",
    };

    function addDataIntoObject(value, key) {
      {
        value && value != undefined ? (data[key] = value) : {};
      }
    }
    {
      schoolId ? addDataIntoObject(schoolId, "schoolId") : addDataIntoObject(collegeId, "collegeId");
    }
    if (userCheck != null && userCheck.length === 0) {
      const user = await User.create(data);
      res.status(201).json({
        status: "New User",
        message: "User signuped successfully",
        data: {
          user,
        },
      });
    } else {
      const user = await User.updateOne({ _id: userCheck[0]._id }, { $set: data });
      res.status(201).json({
        status: "Existing User",
        message: "User Updated successfully",
        data: {
          user,
        },
      });
    }
  } catch (err) {
    console.log(`err`, err);
  }
}
