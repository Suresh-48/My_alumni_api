import groupMembers from "../models/groupMembersModel.js";
import group from "../models/groupModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
import dotenv from "dotenv";
import twilio from "twilio";

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
    const exist = await groupMembers.find({ userId: userId, groupId: groupId, schoolId: schoolId });
    console.log("Exist--------------->", exist.length);
    if (exist.length == 0) {
      const members = await groupMembers.create({
        userId: userId,
        groupId: groupId,
        schoolId: schoolId,
      });

      res.status(201).json({
        status: "success",
        message: " Request Send successfully",
        data: {
          members,
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
    console.log(`id------------------------------->Approved`, id);
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
    const phone = req.body.phone;
    const groupId = req.body.groupId;
    const schoolId = req.body.schoolId;
    const user = await User.find({ phone: phone });
    if (user.length == 0) {
      {
        const phone = req.body.phone;
        const groupId = req.body.groupId;
        const schoolId = req.body.schoolId;
        const newUser = await User.create({
          phone: phone,
          email: Math.random(),
        });
        client.messages.create({
          body: "Hi - Your friend <friend name> has invited you join the alumni group using the <app link> ",
          from: "+1 415 549 0167",
          to: req.body.phone,
        });
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
      console.log("findExist-------------->", findExist.length);
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
        client.messages.create({
          body: "You Are Invited From Alumni App ",
          from: "+1 415 549 0167",
          to: req.body.phone,
        });
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

//pending members list by user id
export async function requestedUsers(req, res, next) {
  try {
    //User id
    const id = req.query.userId;
    console.log(`id-------------->`, id);
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

    // console.log(`doc`, doc);
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
