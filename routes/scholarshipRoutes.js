import { Router } from "express";
const router = Router();

import {
  getAllScholarships,
  getScholarship,
  updateScholarship,
  deleteScholarship,
  createScholarship,
} from "../controllers/scholarshipController.js";

router.route("/").get(getAllScholarships);

router.route("/").post(createScholarship);

router.route("/:id").get(getScholarship);

router.route("/:id").get(getScholarship).patch(updateScholarship).delete(deleteScholarship);

export default router;
