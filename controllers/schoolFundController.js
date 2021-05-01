import schoolFund from "../models/schoolFundModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne } from "./baseController.js";
export async function createSchoolFund(req, res, next) {
  try {
    const data = req.body;
    const fund = await schoolFund.create(data);

    res.status(201).json({
      status: "success",
      message: "SchoolFund created successfully",
      data: {
        fund,
      },
    });
  } catch (err) {
    next(err);
  }
}
export const getAllSchoolFunds = getAll(schoolFund);
export const getSchoolFund = getOne(schoolFund);
export const updateSchoolFund = updateOne(schoolFund);
export const deleteSchoolFund = deleteOne(schoolFund);
