import groupMembers from "../models/groupMembersModel.js";
import group from "../models/groupModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
import dotenv from "dotenv";
import twilio from "twilio"; 
import sendSms from "../utils/sms.js"
import school from "../models/schoolModel.js";

dotenv.config({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function deleteMe(req, res, next) {
  try {
    await groupMembers.findByIdAndUpdate(req.user.id, {
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

export async function createGroupMembers(req, res, next) {
  try {
    const userId = req.body.userId;
    const groupId = req.body.groupId;
    const schoolId = req.body.schoolId;
    const exist = await groupMembers.find({ userId: userId, groupId: groupId, schoolId: schoolId })
    const doc = await group.findById({_id: groupId});
    const user = await User.findById({_id: userId});
    const admin = await User.findById({_id:doc.createdBy});
    const schoolName = await school.findById({_id: schoolId})
    const friendName = user.firstName+" "+user.lastName
    const adminphone = admin.phone
    if (exist.length == 0) {
      const members = await groupMembers.create({
        userId: userId,
        groupId: groupId,
        schoolId: schoolId,
      });
    const message = "Hi "+admin.firstName+", Your friend "+friendName+" Is Requested You To Join Batch "+doc.name+" of "+schoolName.name+".";
     sendSms(message,adminphone)
    res.status(201).json({
        status: "success",
        message: " Request Send successfully",
        data: {
          members,
          doc:doc.createdBy,
        },
      });
    } else {
      const filter = {
        userId: userId,
        groupId: groupId,
        schoolId: schoolId,
      };
      const update = {
        userId: userId,
        groupId: groupId,
        schoolId: schoolId,
      };
      const members = await groupMembers.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
      });

      res.status(201).json({
        status: "success",
        message: "You are Already Requested to this Batch ",
        data: {
          members,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getLists(req, res, next) {
  try {
    //Group id
    const id = req.query.id;
    // const createdUserId = await groupMembers.find({ groupId: id });
    const doc = await groupMembers
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
            from: "groups",
            localField: "groupId",
            foreignField: "_id",
            as: "Group",
          },
        },
      ])
      .match({
        $and: [
          {
            groupId: mongoose.Types.ObjectId(id),
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
    const groupId = req.body.groupId;
    const schoolId = req.body.schoolId;
    const user = await User.find({ phone: phone });
    const referralName = await User.findById({_id: referral});
    const doc = await group.findById({_id: groupId});
    const schoolName = await school.findById({_id: schoolId});
    const groupName = doc.name;

    if (user.length == 0) {
      {
        const phone = req.body.phone;
        const groupId = req.body.groupId;
        const schoolId = req.body.schoolId;
        const newUser = await User.create({
          phone: phone,
          email: Math.random(),
        });

        const body = "Hi - Your Friend "+referralName.firstName+" Has Invited You To Join The Alumni Batch "+doc.name+" of "+schoolName.name +" Using The <app link> "
        sendSms(body,phone)

        const newMemberRequest = await groupMembers.create({
          userId: newUser._id,
          groupId: groupId,
          schoolId: schoolId,
          status: "requested",
        });

        res.status(200).json({
          status: "USER Not Found",
          message: "Invite Send Successfully",
          data: {
            newUser,
            newMemberRequest,
          },
        });
      }
    } else {
      //upsert
      const findExist = await groupMembers.find({
        userId: user[0]._id,
        groupId: groupId,
        schoolId: schoolId,
      });

      if (findExist.length == 0) {
        const filter = {
          userId: user[0]._id,
          groupId: groupId,
          schoolId: schoolId,
        };
        const update = {
          userId: user[0]._id,
          groupId: groupId,
          status: "requested",
          schoolId: schoolId,
        };
        const newMemberRequest = await groupMembers.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true,
        });
        const body = "Hi - Your Friend "+referralName.firstName+" Has Invited You To Join The Alumni Batch "+doc.name+" of "+schoolName.name +" From Alumni App";
        sendSms(body,phone);

        res.status(200).json({
          status: "Invite Sent Successfully",
          message: "Invite Sent Successfully ",
          data: {
            newMemberRequest,
          },
        });
      } else {
        client.messages.create({
          body: "You Are Invited From Alumni App ",
          from: "+1 415 549 0167",
          to: req.body.phone,
        });
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
export async function getApprovedMembersLists(req, res, next) {
  try {
    //groupId
    const id = req.query.groupId;
    const doc = await groupMembers
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
            from: "groups",
            localField: "groupId",
            foreignField: "_id",
            as: "Group",
          },
        },
      ])
      .match({
        $and: [
          {
            groupId: mongoose.Types.ObjectId(id),
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
// export async function userGroups(req, res, next) {
//   res.status(200).json({
//     status: "success",
//   });
// }

export const getAllGroupMembers = getAll(groupMembers);
export const getGroupMembers = getOne(groupMembers);
export const updateGroupMembers = updateOne(groupMembers);
export const deleteGroupMembers = deleteOne(groupMembers);

export async function AcceptedMessage(req, res, next) {
  try {
    const userId = req.body.id;
    const groupId = req.body.groupId;
    const doc = await group.findById({_id: groupId});
    const admin = await User.findById({_id: doc.createdBy});
    const user = await User.findById({_id: userId});
    const adminName = admin.firstName+" "+admin.lastName
    const userPhone = user.phone
    const message = "Your friend"+" "+adminName+" "+"Is Accepted Your Join Request Of Batch"+" "+doc.name+"."
    sendSms(message,userPhone)
    res.status(201).json({
        status: "success",
        message: " Request Send successfully",
        data: {
          userId,groupId
        },
      });
    }
  catch (err) {
    next(err);
  }
}

//pending members list by user id
export async function requestedUsers(req, res, next) {
  try {
    //User id
    const id = req.query.userId;
    const doc = await groupMembers
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
            from: "groups",
            localField: "groupId",
            foreignField: "_id",
            as: "Group",
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
