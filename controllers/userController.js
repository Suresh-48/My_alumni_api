import User from "../models/userModel.js";
import Group from "../models/groupModel.js";
// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";

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
  //   try {
  //     console.log(`req.body`, req.params.id);
  //     const data = await (await User.findOne(req.params.id).populate("Group")).execPopulate();
  //     console.log(`data-------->`, data);
  //     res.status(200).json({
  //       status: "Users Group Displayed ",
  //       data,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
}
export const getAllUsers = getAll(User);
export const getUser = getOne(User);

export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
