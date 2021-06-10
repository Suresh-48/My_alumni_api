import User from "../models/userModel.js";
import Group from "../models/groupModel.js";
// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
import groupMembers from "../models/groupMembersModel.js";

export async function deleteMe(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      active: false,
    });

    res.status(204).json({
      status: "Updated Successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getGroups(req, res, next) {
  try {
    //User id
    const userId = req.params.id;
    const data = await groupMembers
      .find({
        userId: userId,
        status: "approved",
      })
      .populate("groupId");
    res.status(200).json({
      status: "Users Group Displayed ",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAvatar(req, res, next) {
  const userId = req.params.id;
  const userDetails = await User.findById(userId);
  if (!userDetails) {
    return next(new Error("User not found"));
  }

  res.status(200).json({
    status: "User updated successfully",
    data: {
      userDetails,
    },
  });
}

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
