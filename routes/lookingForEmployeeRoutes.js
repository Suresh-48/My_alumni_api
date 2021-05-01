import { Router } from "express";
const router = Router();

// LookingForEmployee Controller
import {
  getAllLookingForEmployees,
  getLookingForEmployee,
  updateLookingForEmployee,
  deleteLookingForEmployee,
  createLookingForEmployee,
} from "../controllers/lookingForEmployeeController.js";

router.route("/").get(getAllLookingForEmployees);

router.route("/").post(createLookingForEmployee);

router.route("/:id").get(getLookingForEmployee);

router.route("/:id").get(getLookingForEmployee).patch(updateLookingForEmployee);

export default router;
