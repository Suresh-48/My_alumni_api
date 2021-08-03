import mongoose from "mongoose";
import collegeGroupMembers from "../models/collegeGroupMembersModel.js";
import collegeGroup from "../models/collegeGroupModel.js";
import User from "../models/userModel.js";

import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";

import sendSms from "../utils/sms.js";
import college from "../models/collegeModel.js";

import getRandomNumberForOtp from "../utils/otp.js";

import { appPlayStoreUrl } from "../config.js";

export async function deleteMe(req, res, next) {
  try {
    await collegeGroupMembers.findByIdAndUpdate(req.user.id, {
      active: false,
    });
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCollegeGroupMembers(req, res, next) {
  try {
    const userId = req.body.userId;
    const collegeGroupId = req.body.collegeGroupId;
    const collegeId = req.body.collegeId;
    const exist = await collegeGroupMembers.find({
      userId: userId,
      collegeGroupId: collegeGroupId,
      collegeId: collegeId,
    });

    const doc = await collegeGroup.findById({ _id: collegeGroupId });
    const user = await User.findById({ _id: userId });
    const admin = await User.findById({ _id: doc.createdBy });
    const collegeName = await college.findById({ _id: collegeId });
    const friendName = `${user.firstName} ${user.lastName}`;

    const adminphone = admin.phone;

    if (exist.length == 0) {
      const collegeMembers = await collegeGroupMembers.create({
        userId: userId,
        collegeGroupId: collegeGroupId,
        collegeId: collegeId,
      });

      const message = `Hi ${admin.firstName} ${admin.lastName}, Your Friend ${friendName} Is Requested You To Join Batch ${doc.name} of ${collegeName.name}.`;
      // sendSms(message, adminphone);

      res.status(201).json({
        status: "success",
        message: " Request Send successfully",
        data: {
          collegeMembers,
          doc: doc.createdBy,
        },
      });
    } else {
      const filter = {
        userId: userId,
        collegeGroupId: collegeGroupId,
        collegeId: collegeId,
      };

      const update = {
        userId: userId,
        collegeGroupId: collegeGroupId,
        collegeId: collegeId,
      };

      const collegeMembers = await collegeGroupMembers.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
      });

      res.status(201).json({
        status: "success",
        message: "You are Already Requested to this Batch ",
        data: {
          collegeMembers,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getCollegeMembersLists(req, res, next) {
  try {
    //Group id
    const id = req.query.id;
    const doc = await collegeGroupMembers
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "User",
          },
        },
        {
          $lookup: {
            from: "collegegroups",
            localField: "collegeGroupId",
            foreignField: "_id",
            as: "collegeGroup",
          },
        },
      ])
      .match({
        $and: [
          {
            collegeGroupId: mongoose.Types.ObjectId(id),
          },
          { status: "pending" },
        ],
      })
      .allowDiskUse(true);

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function invite(req, res, next) {
  try {
    const referral = req.body.referral;
    const phone = req.body.phone;
    const collegeGroupId = req.body.collegeGroupId;
    const collegeId = req.body.collegeId;

    const user = await User.find({ phone: phone });

    const referralName = await User.findById({ _id: referral });

    const collegeGroupDetails = await collegeGroup.findById({ _id: collegeGroupId });

    const collegeName = await college.findById({ _id: collegeId });

    if (user.length === 0) {
      {
        const otp = getRandomNumberForOtp(1000, 9999);

        const phone = req.body.phone;
        const collegeGroupId = req.body.collegeGroupId;
        const collegeId = req.body.collegeId;

        const newCollegeUser = await User.create({
          active: false,
          phone: phone,
          email: Math.random(),
          otp: otp,
        });

        const message = `Hi - Your Friend ${referralName.firstName} Has Invited You To Join The Alumni Batch ${collegeGroupDetails.name} of ${collegeName.name} \n Using The ${appPlayStoreUrl}`;
        sendSms(message, phone);
        const newCollegeMemberRequest = await collegeGroupMembers.create({
          userId: newCollegeUser._id,
          collegeGroupId: collegeGroupId,
          collegeId: collegeId,
          status: "requested",
        });
        res.status(200).json({
          status: "User Not Found",
          message: "Invite Send Successfully",
          data: {
            newCollegeUser,
            newCollegeMemberRequest,
          },
        });
      }
    } else {
      //upsert
      const findExist = await collegeGroupMembers.find({
        userId: user[0]._id,
        collegeGroupId: collegeGroupId,
        collegeId: collegeId,
      });
      if (findExist.length == 0) {
        const filter = {
          userId: user[0]._id,
          collegeGroupId: collegeGroupId,
          collegeId: collegeId,
        };

        const update = {
          userId: user[0]._id,
          collegeGroupId: collegeGroupId,
          collegeId: collegeId,
          status: "requested",
        };

        const newCollegeMemberRequest = await collegeGroupMembers.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true,
        });
        const message = `Hi - Your Friend ${referralName.firstName} Has Invited You To Join The Alumni Batch ${collegeGroupDetails.name} of ${collegeName.name} From Alumni App`;

        // sendSms(message, phone);

        res.status(200).json({
          status: "Invite Sent Successfully",
          message: "Invite Sent Successfully ",
          data: {
            newCollegeMemberRequest,
          },
        });
      } else {
        res.status(200).json({
          status: "Already Sent Invite",
          message: "Already Sent Invite",
          data: {
            findExist,
          },
        });
      }
    }
  } catch (error) {
    next(error);
  }
}

export async function getApprovedCollegeMembersLists(req, res, next) {
  try {
    //groupId
    const id = req.query.collegeGroupId;
    const doc = await collegeGroupMembers
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "User",
          },
        },
        {
          $lookup: {
            from: "collegeGroups",
            localField: "collegeGroupId",
            foreignField: "_id",
            as: "collegeGroup",
          },
        },
      ])
      .match({
        $and: [
          {
            collegeGroupId: mongoose.Types.ObjectId(id),
          },
          { status: "approved" },
        ],
      })
      .allowDiskUse(true);

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  } catch (error) {
    next(error);
  }
}

export const getAllCollegeGroupMembers = getAll(collegeGroupMembers);
export const getCollegeGroupMembers = getOne(collegeGroupMembers);
export const updateCollegeGroupMembers = updateOne(collegeGroupMembers);
export const deleteCollegeGroupMembers = deleteOne(collegeGroupMembers);

export async function AcceptedMessage(req, res, next) {
  try {
    const userId = req.body.id;
    const collegeGroupId = req.body.collegeGroupId;
    const doc = await collegeGroup.findById({ _id: collegeGroupId });
    const admin = await User.findById({ _id: doc.createdBy });
    const user = await User.findById({ _id: userId });
    const adminName = `${admin.firstName} ${admin.lastName}`;
    const userPhone = user.phone;
    const message = `Your friend ${adminName} Is Accepted Your Join Request Of Batch ${doc.name}.`;

    // sendSms(message, userPhone);

    res.status(201).json({
      status: "success",
      message: " Request Send successfully",
      data: {
        userId,
        collegeGroupId,
      },
    });
  } catch (err) {
    next(err);
  }
}

//pending members list by user id
export async function requestedUsers(req, res, next) {
  try {
    //User id
    const id = req.query.userId;
    const doc = await collegeGroupMembers
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "User",
          },
        },
        {
          $lookup: {
            from: "collegegroups",
            localField: "collegeGroupId",
            foreignField: "_id",
            as: "collegeGroup",
          },
        },
      ])
      .match({
        $and: [
          {
            userId: mongoose.Types.ObjectId(id),
          },
          { status: "requested" },
        ],
      })
      .allowDiskUse(true);

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  } catch (error) {
    next(error);
  }
}
