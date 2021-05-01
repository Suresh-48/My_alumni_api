import scholarship from "../models/scholarshipModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
export async function createScholarship(req, res, next) {
  try {
    const data = req.body;
    const fund = await scholarship.create(data);

    res.status(201).json({
      status: "success",
      message: "scholarship created successfully",
      data: {
        fund,
      },
    });
  } catch (err) {
    next(err);
  }
}
export const getAllScholarships = getAll(scholarship);
export const getScholarship = getOne(scholarship);
export const updateScholarship = updateOne(scholarship);
export const deleteScholarship = deleteOne(scholarship);
