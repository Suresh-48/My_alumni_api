import UserPermission from "../models/userPermissionModel.js";
import User from "../models/userModel.js";
// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";

export async function createUserPermissions(req, res, next) {
  try {
    //user Id>

    const userId = req.body.userId;
    const requestedUserId = req.body.requestedUserId;
    const checkDuplicate = await UserPermission.find({
      userId: userId,
      requestedUserId: requestedUserId,
    });
    if (checkDuplicate == 0) {
      const permission = await UserPermission.create({
        userId: userId,
        requestedUserId: requestedUserId,
      });
      res.status(200).json({
        status: "success",
        results: permission.length,
        message: "Requested Successfully",
        data: {
          permission,
        },
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Request Already Successfully",
        data: {
          checkDuplicate,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function getUserPermissions(req, res, next) {
  try {
    //user Id
    // console.log("req------->", req);
    const userId = req.query.userId;
    const requestedUserId = req.query.requestedUserId;

    const permission = await UserPermission.find({
      userId: userId,
      requestedUserId: requestedUserId,
      status: "Accepted",
    });
    console.log(`permission`, permission.length);
    res.status(200).json({
      status: "success",
      result: permission.length,
      data: {
        permission,
      },
    });
  } catch (err) {
    next(err);
  }
}
export async function getUserPermissionsRequest(req, res, next) {
  try {
    //user Id

    const userId = req.query.userId;
    console.log(`userId------------>`, userId);
    const permission = await UserPermission.find({
      userId: userId,
      status: "Requested",
    }).populate("requestedUserId");
    console.log(`permission`, permission);
    // const doc = await permission
    // const doc = await UserPermission.aggregate([
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "requestedUserId",
    //       foreignField: "_id",
    //       as: "User",
    //     },
    //   },
    // ])
    //   .match({
    //     $and: [
    //       // {
    //       //   userId: mongoose.Types.ObjectId(userId),
    //       // },
    //       { status: "Requested" },
    //     ],
    //   })
    //   .allowDiskUse(true);
    //  console.log(`doc------------>`, doc);
    res.status(200).json({
      status: "success",
      result: permission.length,
      data: {
        permission,
      },
    });
  } catch (err) {
    next(err);
  }
}
export const getAllUserPermissions = getAll(UserPermission);
export const getUserPermission = getOne(UserPermission);
export const updateUserPermission = updateOne(UserPermission);
export const deleteUserPermission = deleteOne(UserPermission);
