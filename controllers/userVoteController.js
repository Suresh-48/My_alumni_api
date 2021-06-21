import User from "../models/userModel.js";
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
    const schoolId = req.query.schoolId;
    resMap(schoolId).then((item) => {
      let userInfo = new Map([...item[1].entries()].sort((a, b) => b[1] - a[1]));
      let userCountInfo = new Map([...item[0].entries()].sort((a, b) => b[1] - a[1]));

      let data = [];
      for (let [key, value] of userCountInfo) {
        console.log(value);
        //console.log("key", key, userCountInfo.get(key));
        // let data = [value, userCountInfo.get(key)];
        data.push({ id: key, vote: value });
        //data.push(value);
      }
      console.log(`data`, data);
      data.forEach((item, i) => {
        console.log(`res`, item.vote);
        User.findById({ _id: item.id }).then((res) => {
          console.log(`res`, item.vote);
        });
      });
      // const userData = User.find({ _id: data.id });
      res.status(200).json({
        status: "success",
        data: data,
      });
    });
  } catch {
    next(err);
  }
}

const resMap = (schoolId) => {
  let map = new Map();
  let userInfoMap = new Map();
  let resArray = [];
  return UserVote.find({ schoolId: schoolId }, { "userId.$": 1 })
    .distinct("userId")
    .then((vote) => {
      return UserVote.find({ schoolId: schoolId, userId: { $in: vote } }).then((count) => {
        return User.find({ _id: { $in: vote } }).then((userInfo) => {
          vote.forEach((res, i) => {
            let countArray = [];
            const found = count.filter(function (obj) {
              if (obj.userId.toString() === res.toString()) {
                countArray.push(obj.createdBy);
                map.set(res.toString(), countArray.length);
              }
            });
            let userMap = new Map();
            const UserInformationFound = userInfo.filter(function (obj) {
              if (obj._id.toString() === res.toString()) {
                // countArray.push(obj.createdBy);
                userMap.set("userId", obj._id);
                userMap.set("userFirstName", obj.firstName);
                userMap.set("userLastName", obj.lastName);
                userMap.set("userImageUrl", obj.avatarUrl);
                userInfoMap.set(res.toString(), userMap);
              }
            });
          });
          resArray.push(map);
          resArray.push(userInfoMap);
          return resArray;
        });
        //return map;
      });
    });
};
export const getAllUserVotes = getAll(UserVote);
export const getUserVote = getOne(UserVote);
export const updateUserVote = updateOne(UserVote);
export const deleteUserVote = deleteOne(UserVote);
