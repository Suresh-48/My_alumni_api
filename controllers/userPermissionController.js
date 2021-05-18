import UserPermission from "../models/userPermissionModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";

export async function createUserPermissions(req, res, next) {
  try {
    //user Id
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
export const getAllUserPermissions = getAll(UserPermission);
export const getUserPermission = getOne(UserPermission);
export const updateUserPermission = updateOne(UserPermission);
export const deleteUserPermission = deleteOne(UserPermission);
