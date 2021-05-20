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

    // const requestedUser = await User.find({
    //   _id: requestedUserId,
    // });
    // console.log(`requestedUser.firstName`, requestedUser);
    // const username = requestedUser[0].firstName + "" + requestedUser[0].lastName;
    const permission = await UserPermission.find({
      userId: userId,
      status: "Requested",
    });
    // const user = await permission.Aggregate({});
    // console.log(`permission`, permission);
    const username = [];
    permission.forEach(async (res, i) => {
      const id = res.requestedUserId;
      const user = await User.find({ _id: id });
      const firstName = user[0].firstName;
      const username = firstName.concat(user[0].lastName);
      username.push(username);
    });
    res.status(200).json({
      status: "success",
      // user: username,
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
