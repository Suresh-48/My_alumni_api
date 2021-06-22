import User from "../models/userModel.js";
import userVoteCounter from "../models/userVoteCounterModel.js";
import UserVote from "../models/userVoteModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export async function deleteUserVote(req, res, next) {
  try {
    const id = req.params.id;
    const data = await UserVote.findOne({
      _id: id,
    });

    const voteCounter = await userVoteCounter.findOne({
      userId: data.userId,
      schoolId: data.schoolId,
    });
    await userVoteCounter.findByIdAndUpdate(voteCounter._id, {
      $set: {
        userId: data.userId,
        schoolId: data.schoolId,
        votes: voteCounter.votes - 1,
      },
    });

    await UserVote.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "Deleted Successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}
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
        const findVote = await userVoteCounter.findOne({
          userId: userId,
          schoolId: schoolId,
        });
        if (findVote === null) {
          const voteCounter = await userVoteCounter.create({
            userId: userId,
            schoolId: schoolId,
            votes: 1,
          });
        } else {
          const voterId = findVote._id;
          const newVote = findVote.votes + 1;
          const update = {
            $set: {
              userId: userId,
              schoolId: schoolId,
              votes: newVote,
            },
          };
          const voteCounter = await userVoteCounter.findByIdAndUpdate(voterId, update);
        }

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
        //console.log("key", key, userCountInfo.get(key));
        // let data = [value, userCountInfo.get(key)];
        data.push({ id: key, vote: value });
        //data.push(value);
      }
      // for (let [key, value] of userInfo) {
      //   //console.log("key", key, userCountInfo.get(key));
      //   // let data = [value, userCountInfo.get(key)];
      //   // console.log(key, value);
      //   let vj = userInfo.get(key);
      //   console.log(`vj`, vj);
      //   //data.push({ id: key, vote: value });
      //   //data.push(value);
      // }
      // console.log(`data`, data);
      const userVoteDetails = [];
      data.forEach((item, i) => {
        // console.log(`res`, item.vote);
        const vv = [];
        User.findById({ _id: item.id }).then((res) => {
          // console.log(`res---->`, res, item.vote);\
          vv.push({ user: res, vote: item.vote });
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
