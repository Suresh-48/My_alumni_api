import lookingForJob from "../models/lookingforjobModel.js";
// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export const createLookingForJob = createOne(lookingForJob);
export const getAllLookingForJobs = getAll(lookingForJob);
export const getLookingForJob = getOne(lookingForJob);
export const updateLookingForJob = updateOne(lookingForJob);
export const deleteLookingForJob = deleteOne(lookingForJob);
