import { Router } from "express";
const router = Router();

// School Controller
import {
  getAll,
  getSchool,
  updateSchool,
  deleteSchool,
  createSchool,
  getLists,
  ListSchoolsFromUser,
  ListUsersFromSchool,
  updateAvatar,
} from "../controllers/schoolController.js";

// Auth Controller

 router.route("/").get(getAll);

router.route("/").post(createSchool);
//school
router.route("/user").get(ListUsersFromSchool);

router.route("/user/school").get(ListSchoolsFromUser);

router.route("/avatar/:id").put(updateAvatar);

router.route("/lists").get(getLists);

router.route("/:id").get(getSchool).patch(updateSchool).delete(deleteSchool);

export default router;