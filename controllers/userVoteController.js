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

export async function voteCounter(req, res, next) {
  try {
    const schoolId = req.body.schoolId;
    resMap(schoolId).then((res) => {
      console.log(`res`, res);
      console.log(typeof res);
    });
    // console.log(
    //   UserVote.find({ schoolId: schoolId }, { "userId.$": 1 })
    //     .distinct("userId")
    //     .then((vote) => {
    //       return UserVote.find({ schoolId: schoolId, userId: { $in: vote } })
    //         .sort({ userId: 1 })
    //         .then((count) => {
    //           vote.forEach((res, i) => {
    //             let countArray = [];
    //             const found = count.filter(function (obj) {
    //               if (obj.userId.toString() === res.toString()) {
    //                 countArray.push(obj.createdBy);
    //                 return map.set(res.toString(), countArray);
    //               }
    //             });
    //           });
    //         });
    //     })
    // );

    // UserVote.find({ schoolId: schoolId, userId: { $in: vote } })
    //   .sort({ userId: 1 })
    //   .then((count) => {
    //     console.log(`count`, count);
    //     vote.forEach((res, i) => {
    //       console.log(`res`, res);
    //       var item = count.find((item) => item.userId === res);
    //       console.log(`item`, item);
    //     });
    //   });
    // vote.forEach((res, i) => {
    //   console.log(`res`, res);
    //   // const usersVotes = count.filter((x) => x.userId === res);
    //   // console.log(`users`, usersVotes);var item = myArray.find(item => item.id === 2);
    //   console.log(`count`, count);
    //   var item = count.find((item) => item.userId === res);
    //   console.log(`item`, item);
    //   // const data = UserVote.find({ userId: res }).length;
    //   // console.log(`data`, data);
    // });
    // const data = vote.projection();
    // console.log(`data`, data);
    // const userVote = [];
    // //Aggregate by School id
    // // sort by total count
    // vote.forEach(async (votes, i) => {
    //   userVote.push(votes.userId);
    // });
    // const counts = {};
    // const value = [];
    // userVote.forEach(function (x) {
    //   const val = (counts[x] = (counts[x] || 0) + 1);
    //   // value.push({ x, val });
    // });
    // console.log(counts);
    // console.log(`value`, value);
    // counts.sort(function (a, b) {
    //   return a.value - b.value;
    // });
    res.status(200).json({
      status: "success",
      results: "1",
    });
  } catch {
    next(err);
  }
}

const resMap = (schoolId) => {
  let map = new Map();
  return UserVote.find({ schoolId: schoolId }, { "userId.$": 1 })
    .distinct("userId")
    .then((vote) => {
      return UserVote.find({ schoolId: schoolId, userId: { $in: vote } })
        .sort({ userId: 1 })
        .then((count) => {
          vote.forEach((res, i) => {
            let countArray = [];
            const found = count.filter(function (obj) {
              if (obj.userId.toString() === res.toString()) {
                countArray.push(obj.createdBy);
                map.set(res.toString(), countArray.length);
              }
            });
          });
          return map;
        });
    });
};
export const getAllUserVotes = getAll(UserVote);
export const getUserVote = getOne(UserVote);
export const updateUserVote = updateOne(UserVote);
export const deleteUserVote = deleteOne(UserVote);
