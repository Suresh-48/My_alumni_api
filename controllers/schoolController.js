import School from "../models/schoolModel.js";
import User from "../models/userModel.js";
import groupMembers from "../models/groupMembersModel.js";
import mongoose from "mongoose";
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";

export async function createSchool(req, res, next) {
  try {
    const data = req.body;
    console.log("data--->", req.body);
    const exist = await School.find({ address1: req.body.address1, name: req.body.name });
    console.log(`exist.length---------->`, exist.length);
    if (exist.length == 0) {
      const Schools = await School.create(data);
      if (Schools) {
        res.status(201).json({
          status: "success",
          message: "School created successfully",
          data: {
            Schools,
          },
        });
      }
    } else {
      res.status(201).json({
        status: "success",
        message: "School Already Exist",
        data: {
          exist,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

export const getAllSchools = getAll(School);
export const getSchool = getOne(School);

export async function getLists(req, res, next) {
  try {
    const data = req.query;

    const doc = await School.find({ createdBy: { $eq: data.userId } });
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

export const updateSchool = updateOne(School);
export const deleteSchool = deleteOne(School);

//School
export async function ListUsersFromSchool(req, res, next) {
  try {
    //user Id
    const userId = req.query.userId;
    const schoolId = req.query.schoolId;
    const doc = await groupMembers
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "Users",
          },
        },
      ])
      .match({
        $and: [
          {
            schoolId: mongoose.Types.ObjectId(schoolId),
          },
          { status: "approved" },
        ],
      })
      .allowDiskUse(true);
    console.log(`doc.length---------->`, doc.length);
    const users = [];
    doc.forEach((res, i) => {
      const userId = res.Users[0]._id;
      if (users.indexOf(`${userId}`) < 0) {
        users.push(`${userId}`);
      }
    });
    const userData = await User.find({ _id: users });
    console.log(`userData-------------->`, userData);

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: userData,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function ListSchoolsFromUser(req, res, next) {
  try {
    //user Id
    const userId = req.query.userId;
    const schoolId = req.query.schoolId;

    console.log("schoolId----------------->", schoolId);
    console.log("userId----------------->", userId);
    const schoolData = await groupMembers.find({
      status: "approved",
      userId: userId,
    });
    console.log(`schoolData.length----->`, schoolData.length);
    const data = [];
    let schoolIds = [];
    schoolData.forEach((schoolDetails) => {
      const schoolId = schoolDetails.schoolId;
      if (schoolIds.indexOf(`${schoolId}`) < 0) {
        schoolIds.push(`${schoolId}`);
      }
    });
    const schoolName = await School.find({ _id: schoolIds });
    res.status(200).json({
      status: "success",
      results: schoolData.length,
      data: {
        data: schoolName,
      },
    });
  } catch (err) {
    next(err);
  }
}
