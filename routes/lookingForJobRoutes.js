import { Router } from "express";
const router = Router();

// LookingForJob Controller
import {
  getAllLookingForJobs,
  getLookingForJob,
  updateLookingForJob,
  deleteLookingForJob,
  createLookingForJob,
} from "../controllers/lookingForJobController.js";

router.route("/").get(getAllLookingForJobs);

router.route("/").post(createLookingForJob);

router.route("/:id").get(getLookingForJob);

router.route("/:id").get(getLookingForJob).patch(updateLookingForJob);

export default router;
