import Event from "../models/eventModel.js";
import mongoose from "mongoose";
import moment from "moment";

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
    console.log(`Group id---------------->`, id);
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
    console.log(`Group id--------2------->`, id);

    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    // const date = moment(d).format(dateFormat);
    console.log(`date----------------->`, d);
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
    console.log(`School id---------------->`, id);
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
    console.log(`School id--------------->`, id);

    const dateFormat = "DD-MM-YYYY";
    let d = new Date();
    // const date = moment(d).format(dateFormat);
    console.log(`date----------------->`, d);
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
