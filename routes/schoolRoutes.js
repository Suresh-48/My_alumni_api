import { Router } from "express";
const router = Router();

// School Controller
import {
  getAllSchools,
  getSchool,
  updateSchool,
  deleteSchool,
  createSchool,
  getLists,
  ListSchoolsFromUser,
} from "../controllers/schoolController.js";

// Auth Controller

router.route("/").get(getAllSchools);

router.route("/").post(createSchool);
//school
router.route("/user").get(ListSchoolsFromUser);

router.route("/lists").get(getLists);

router.route("/:id").get(getSchool).patch(updateSchool).delete(deleteSchool);

export default router;
