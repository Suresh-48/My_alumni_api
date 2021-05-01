import lookingForEmployee from "../models/lookingForEmployee.js";
// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export const createLookingForEmployee = createOne(lookingForEmployee);
export const getAllLookingForEmployees = getAll(lookingForEmployee);
export const getLookingForEmployee = getOne(lookingForEmployee);
export const updateLookingForEmployee = updateOne(lookingForEmployee);
export const deleteLookingForEmployee = deleteOne(lookingForEmployee);
