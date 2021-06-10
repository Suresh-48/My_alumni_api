import Event from "../models/eventModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import groupMembers from "../models/groupMembersModel.js";

import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export async function deleteMe(req, res, next) {
  try {
    await Event.findByIdAndUpdate(req.user.id, {
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

export async function createEvent(req, res, next) {
  try {
    const data = req.body;
    const exist = await Event.find({
      title: data.title,
      date: data.date,
      schoolId: data.schoolId,
      groupId: data.groupId,
    });
    if (exist.length == 0) {
      const event = await Event.create(data);
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

export const getAllEvents = getAll(Event);
export const getEvent = getOne(Event);
export async function getLists(req, res, next) {
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

export async function pastEvents(req, res, next) {
  try {
    //pass group id
    const id = req.query.groupId;
    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    const doc = await Event.aggregate([
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
            groupId: mongoose.Types.ObjectId(id),
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
export async function upcomingEvents(req, res, next) {
  try {
    const id = req.query.groupId;
    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    // const date = moment(d).format(dateFormat);
    const doc = await Event.aggregate([
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
            groupId: mongoose.Types.ObjectId(id),
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

export const updateEvent = updateOne(Event);
export const deleteEvent = deleteOne(Event);

//Create Event Based On School
export async function createEventBasedOnSchool(req, res, next) {
  try {
    const data = req.body;
    const event = await Event.create(data);
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
export async function pastEventsBasedOnSchool(req, res, next) {
  try {
    //pass schoolId id
    const id = req.query.schoolId;
    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    const doc = await Event.aggregate([
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
            schoolId: mongoose.Types.ObjectId(id),
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

export async function upcomingEventsBasedOnSchool(req, res, next) {
  try {
    const id = req.query.schoolId;

    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    // const date = moment(d).format(dateFormat);
    const doc = await Event.aggregate([
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
            schoolId: mongoose.Types.ObjectId(id),
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
    const schoolId = req.query.schoolId;
    const eventTitle = req.query.eventTitle;
    const location = req.query.location;
    const dateTime = req.query.dateTime;

    const doc = await groupMembers
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
            schoolId: mongoose.Types.ObjectId(schoolId),
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
    const groupId = req.body.groupId;
    const users = [];
    const userData = []
    groupId.forEach(async(res,i)=>{
      const group = await groupMembers.find({
        groupId :res,
        status: "approved" 
      }).populate('userId');
      const userData = group[0].userId.phone;
         if (users.indexOf(`${userData}`) < 0) {
            users.push(`${userData}`);
         // sendSms("message",userData);
          }  
    })
       res.status(200).json({
      status: "success",
      data: {
        eventTitle,
        location,
        dateTime,
        userData        
      },
    });
  } catch (err) {
    next(err);
  }
}




