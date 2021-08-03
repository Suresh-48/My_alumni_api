import collegeEvent from "../models/collegeEventModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import collegeGroupMembers from "../models/collegeGroupMembersModel.js";

import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";
//Delete Event based On Id
export async function deleteMe(req, res, next) {
  try {
    await collegeEvent.findByIdAndUpdate(req.user.id, {
      active: false,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}
// Create a Event
export async function createCollegeEvent(req, res, next) {
  try {
    const data = req.body;
    const exist = await collegeEvent.find({
      title: data.title,
      date: data.date,
      collegeId: data.collegelId,
      collegeGroupId: data.collegeGroupId,
    });
    if (exist.length == 0) {
      const event = await collegeEvent.create(data);
      res.status(201).json({
        status: "success",
        message: "Event created successfully",
        data: {
          event,
        },
      });
    } else {
      res.status(201).json({
        status: "success",
        message: "Event Already Exist",
      });
    }
  } catch (err) {
    next(err);
  }
}

export const getAllCollegeEvents = getAll(collegeEvent);
export const getCollegeEvent = getOne(collegeEvent);
export async function getCollegeEventLists(req, res, next) {
  try {
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

export async function collegePastEvents(req, res, next) {
  try {
    //pass group id
    const id = req.query.collegeGroupId;
    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    const doc = await collegeEvent.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "co1",
          foreignField: "_id",
          as: "User",
        },
      },
    ])
      .match({
        $and: [
          {
            collegeGroupId: mongoose.Types.ObjectId(id),
          },
          {
            date: { $lt: d },
          },
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
  } catch (error) {
    next(error);
  }
}
export async function collegeUpcomingEvents(req, res, next) {
  try {
    const id = req.query.collegeGroupId;
    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    // const date = moment(d).format(dateFormat);
    const doc = await collegeEvent.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "co1",
          foreignField: "_id",
          as: "User",
        },
      },
    ])
      .match({
        $and: [
          {
            collegeGroupId: mongoose.Types.ObjectId(id),
          },
          {
            date: { $gte: d },
          },
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
  } catch (error) {
    next(error);
  }
}

export const updateCOllegeEvent = updateOne(collegeEvent);
export const deleteCollegeEvent = deleteOne(collegeEvent);

//Create Event Based On School
export async function createEventBasedOnCollege(req, res, next) {
  try {
    const data = req.body;
    const event = await collegeEvent.create(data);
    res.status(201).json({
      status: "success",
      message: "Event created successfully",
      data: {
        event,
      },
    });
  } catch (err) {
    next(err);
  }
}
//pastEvents based on School Id
export async function pastEventsBasedOnCollege(req, res, next) {
  try {
    //pass schoolId id
    const id = req.query.collegeId;
    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    const doc = await collegeEvent.aggregate([
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "co1",
      //     foreignField: "_id",
      //     as: "User",
      //   },
      // },
    ])
      .match({
        $and: [
          {
            collegeId: mongoose.Types.ObjectId(id),
          },
          {
            date: { $lt: d },
          },
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
  } catch (error) {
    next(error);
  }
}

export async function upcomingEventsBasedOnCollege(req, res, next) {
  try {
    const id = req.query.collegeId;

    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    // const date = moment(d).format(dateFormat);
    const doc = await collegeEvent.aggregate([
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "co1",
      //     foreignField: "_id",
      //     as: "User",
      //   },
      // },
    ])
      .match({
        $and: [
          {
            collegeId: mongoose.Types.ObjectId(id),
          },
          {
            date: { $gte: d },
          },
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
  } catch (error) {
    next(error);
  }
}

export async function allUserSms(req, res, next) {
  try {
    const collegeId = req.query.collegeId;
    const eventTitle = req.query.eventTitle;
    const location = req.query.location;
    const dateTime = req.query.dateTime;

    const doc = await collegeGroupMembers
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "Users",
          },
        },
      ])
      .match({
        $and: [
          {
            collegeId: mongoose.Types.ObjectId(collegeId),
          },
          { status: "approved" },
        ],
      })
      .allowDiskUse(true);

    const users = [];
    doc.forEach((res, i) => {
      const userId = res.Users[0].phone;
      if (users.indexOf(`${userId}`) < 0) {
        users.push(`${userId}`);
      }
    });
    // sendSms ("message",users)
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        data: users,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function individualUserSms(req, res, next) {
  try {
    const userId = req.body.userId;
    const eventTitle = req.body.eventTitle;
    const location = req.body.location;
    const dateTime = req.body.dateTime;

    const users = [];
    userId.forEach(async (res, i) => {
      const userId = res;
      const phone = await User.findById({ _id: userId });
      if (users.indexOf(phone.phone) < 0) {
        users.push(phone.phone);
      }
    });
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (err) {
    next(err);
  }
}

export async function sendSmsToSelectedGroup(req, res, next) {
  try {
    const eventTitle = req.body.eventTitle;
    const location = req.body.location;
    const dateTime = req.body.dateTime;
    const collegeGroupId = req.body.collegeGroupId;
    const users = [];
    const userData = [];
    collegeGroupId.forEach(async (res, i) => {
      const group = await collegeGroupMembers
        .find({
          collegeGroupId: res,
          status: "approved",
        })
        .populate("userId");
      const userData = group[0].userId.phone;
      if (users.indexOf(`${userData}`) < 0) {
        users.push(`${userData}`);
        // sendSms("message",userData);
      }
    });
    res.status(200).json({
      status: "success",
      data: {
        eventTitle,
        location,
        dateTime,
        userData,
      },
    });
  } catch (err) {
    next(err);
  }
}
