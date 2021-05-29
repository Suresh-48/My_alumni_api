import UserVote from "../models/userVoteModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export async function voteCreatedByUser(req, res, next) {
  try {
    const createdBy = req.query.createdBy;
    const findUser = await UserVote.find({
      createdBy: createdBy,
    }).populate("userId");

    res.status(200).json({
      status: "success",
      results: findUser.length,
      data: {
        data: findUser,
      },
    });
  } catch {
    next(err);
  }
}
export async function createUserVotes(req, res, next) {
  try {
    //user Id
    const createdBy = req.body.createdBy;
    const userId = req.body.userId;
    const schoolId = req.body.schoolId;
    const Voted = req.body.checked;
    const findUser = await UserVote.find({
      createdBy: createdBy,
    });
    console.log(`findUser.length`, findUser.length);
    if (findUser.length <= 2) {
      const vote = await UserVote.find({
        createdBy: createdBy,
        userId: userId,
        schoolId: schoolId,
      });
      if (vote.length === 0) {
        const firstVote = await UserVote.create({
          createdBy: createdBy,
          userId: userId,
          schoolId: schoolId,
          checked: Voted,
        });
        res.status(200).json({
          status: "success",
          results: firstVote.length,
          data: {
            data: firstVote,
          },
        });
      } else {
        res.status(200).json({
          status: "success",
          results: vote.length,
          message: "Already Voted",
          data: {
            data: vote,
          },
        });
      }
    } else {
      res.status(200).json({
        status: "success",
        results: findUser.length,
        message: "Maximum Votes Used Already",
      });
    }
  } catch (err) {
    next(err);
  }
}

export const getAllUserVotes = getAll(UserVote);
export const getUserVote = getOne(UserVote);
export const updateUserVote = updateOne(UserVote);
export const deleteUserVote = deleteOne(UserVote);
