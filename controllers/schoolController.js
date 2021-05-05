import School from "../models/schoolModel.js";
import User from "../models/groupModel.js";
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
    // console.log("schoolId----------------->", schoolId);
    // console.log("userId----------------->", userId);
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
      // console.log(`res------->`, res.Users[0].firstName);
      // const firstName = res.Users[0].firstName;
      // const lastName = res.Users[0].lastName;
      // console.log(`name---->`, firstName + +lastName);
      // users.push([firstName, lastName]);
      console.log(`res.Users[0]._id`, res.Users[0]._id);
      const userId = res.Users[0]._id;
      if (users.indexOf(`${userId}`) < 0) {
        //  console.log(`object->`, schoolIds.indexOf(schoolDetails.schoolId));
        users.push(`${userId}`);
      }
    });
    console.log(`users---------->`, users);
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: users,
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
      //   console.log(`schoolDetails------->`, schoolDetails);
      const schoolId = schoolDetails.schoolId;
      // console.log(`schoolId`, typeof schoolId, schoolIds);
      if (schoolIds.indexOf(`${schoolId}`) < 0) {
        //  console.log(`object->`, schoolIds.indexOf(schoolDetails.schoolId));
        schoolIds.push(`${schoolId}`);
      }
    });
    console.log("schoolIds--->", schoolIds);
    res.status(200).json({
      status: "success",
      results: schoolData.length,
      data: {
        data: schoolIds,
      },
    });
  } catch (err) {
    next(err);
  }
}
