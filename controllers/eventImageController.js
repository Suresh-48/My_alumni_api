import mongoose from "mongoose";
import eventImage from "../models/eventImagesModel.js";
import Event from "../models/eventModel.js";
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";
import { getPublicImagUrl, uploadBase64File } from "../utils/s3.js";

export async function updateEventImages(req, res, next) {
    try {
    const eventId = req.body.id;
    const data = req.body
        const event = await eventImage.create(data);
        res.status(201).json({
          status: "success",
          message: "Event Images uploaded successfully",
          data: {
            event,
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
  
    // Upload file
    uploadBase64File(file, filePath, (err, mediaPath) => {
      if (err) {
        return callback(err);
      }
  
      eventImage.updateOne(
        { eventId: eventId }, // Filter
        { image: mediaPath , imageUrl: getPublicImagUrl(mediaPath) } // Update
 
      )
        .then((obj) => {
          res.status(200).json({
            status: "Event Image Uploaded successfully",
            data: {
              eventId,
              mediaPath
            },
          });
        })
        .catch((err) => {
          console.log("Error: " + err);
        });
    });
  }
  
  export const updateEvent = updateOne(eventImage);
