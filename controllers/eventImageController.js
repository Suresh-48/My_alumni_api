import mongoose from "mongoose";
import eventImage from "../models/eventImagesModel.js";
import Event from "../models/eventModel.js";
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";

export async function PastEventImage(req, res, next) {
  try {
    const eventId = req.body.eventId;
    const data = await eventImage.find({ eventId: eventId });
    console.log(">?>?>?>", data);
    res.status(201).json({
      status: "success",
      message: "Event Images uploaded successfully",
      data: {
        data,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateEventImage(req, res, next) {
  const eventId = req.params.id;
  const file = req.body.image;
  const USER_PATH = "media/events";
  const type = file && file.split(";")[0].split("/")[1];
  const fileName = `${eventId}.${type}`;
  const filePath = `${USER_PATH}/${fileName}`;

  const eventDetails = await Event.findById(eventId);
  if (!eventDetails) {
    return next(new Error("Event not found"));
  }

  uploadBase64File(file, filePath, (err, mediaPath) => {

    if (err) {
      return callback(err);
    }

    eventImage
      .updateOne(
        { eventId: eventId }, // Filter
        { image: mediaPath, imageUrl: getPublicImagUrl(mediaPath) } // Update
      )
      .then((obj) => {
        res.status(200).json({
          status: "Event Image Uploaded successfully",
          data: {
            mediaPath,
          },
        });
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  });
}

export async function postEventImage(req, res, next) {
  const eventId = req.body.eventId;
  const file = req.body.image;
  const USER_PATH = "media/events";
  const type = file && file.split(";")[0].split("/")[1];
  const fileName = `${eventId}.${type}`;
  const filePath = `${USER_PATH}/${fileName}`;

    uploadBase64File(file, filePath, (err, mediaPath) => {

    if (err) {
      return callback(err);
    }

    eventImage
      .create(
        { eventId: eventId, image: mediaPath, imageUrl: getPublicImagUrl(mediaPath) } // Update
      )
      .then((obj) => {
      res.status(200).json({
        status: "Event Image Uploaded successfully",
        data: {
         obj,
        },
      });
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  });
 
}
