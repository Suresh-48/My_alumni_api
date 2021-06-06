import Group from "../models/groupModel.js";
import mongoose from "mongoose";
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";
import groupMembers from "../models/groupMembersModel.js";
import group from "../models/groupModel.js";

export async function deleteMe(req, res, next) {
  try {
    await Group.findByIdAndUpdate(req.user.id, {
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

export async function createGroup12(req, res, next) {
  try {
    const name = req.body.name;
    const createdBy = req.body.createdBy;
    const schoolId = req.body.schoolId;
    console.log("data--------------------------->", name);
    console.log("createdBy--------------------------->", createdBy);
    console.log("schoolId--------------------------->", schoolId);
    const group1 = await Group.find(
      { name: name, schoolId: schoolId }
      //If suppose we added School Find School Id and Group name
      //,{schoolId:schoolId}
    );
    if (group1.length == 0) {
      const group = await Group.create({ name: name, createdBy: createdBy, schoolId: schoolId });
      const groupId = group.id;
      const adminJoin = await groupMembers.create({
        userId: createdBy,
        groupId: groupId,
        schoolId: schoolId,
        status: "approved",
      });
      res.status(201).json({
        status: "success",
        message: "Group created successfully",
        data: {
          group,
          adminJoin,
        },
      });
    } else {
      res.status(200).json({
        message: "Group Name Already Exist",
        data: {
          group1,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

export const getAllGroups = getAll(Group);
export const getGroup = getOne(Group);
export const createGroup = createOne(Group);

export async function getLists(req, res, next) {
  try {
    const id = req.query.userId;
    console.log(`id-------------->`, id);
    const doc = await Group.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users",
        },
      },
    ])
      .match({
        $and: [
          {
            createdBy: mongoose.Types.ObjectId(id),
          },
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

export const updateGroup = updateOne(Group);
export const deleteGroup = deleteOne(Group);

//Get User Group
export async function ListGroupsFromUser(req, res, next) {
  try {
    //user Id
    const userId = req.query.userId;
    const schoolId = req.query.schoolId;
    const doc = await groupMembers
      .aggregate([
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
            userId: mongoose.Types.ObjectId(userId),
            schoolId: mongoose.Types.ObjectId(schoolId)
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
  } catch (err) {
    next(err);
  }
}

export async function ListGroupsFromSchool(req, res, next) {
  try {
    //schoolId
    const schoolId = req.query.schoolId;
    const schoolGroups = await group.find({ schoolId: schoolId });
    res.status(200).json({
      status: "success",
      results: schoolGroups.length,
      data: {
        data: schoolGroups,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function myGroups(req, res, next) {
  try {
    const id = req.body.userId;
    console.log(`id-------------->`, id);
    const userGroup = await groupMembers
      .find({
        userId: id,
        status: "approved",
      })
      .populate({ path: "groupId", select: "name" })
      .populate({ path: "schoolId", select: "name" });

    console.log(`userGroup`, userGroup);
    res.status(200).json({
      status: "success",
      results: userGroup.length,
      data: {
        data: userGroup,
      },
    });
  } catch (error) {
    next(error);
  }
}