import knowledgeSharing from "../models/knowledgeSharingModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export async function createKnowledgeSharing(req, res, next) {
  try {
    const data = req.body;
    const exist = await knowledgeSharing.find({
      title: data.title,
      description: data.description,
      userId: data.userId,
    });
    if (exist.length == 0) {
      const knowledge = await knowledgeSharing.create(data);
      res.status(201).json({
        status: "success",
        message: "knowledge sharing created successfully",
        data: {
          knowledge,
        },
      });
    } else {
      res.status(201).json({
        status: "success",
        message: "knowledge sharing Already Exist",
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getAllKowledgeSharing(req, res, next) {
  try {
    const category = req.query.category;
    const data = await knowledgeSharing
      .find({ category: category })
      .populate({ path: "userId", select: ["firstName", "lastName", "avatarUrl"] });
    res.status(200).json({
      status: "success",
      message: "Data Get Sucessfully",
      data: {
        data: data,
      },
    });
  } catch (err) {
    next(err);
  }
}

export const getKowledgeSharing = getOne(knowledgeSharing);
export const updateKowledgeSharing = updateOne(knowledgeSharing);
export const deleteKowledgeSharing = deleteOne(knowledgeSharing);
