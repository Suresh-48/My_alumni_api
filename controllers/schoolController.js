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
export async function ListSchoolsFromUser(req, res, next) {
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
