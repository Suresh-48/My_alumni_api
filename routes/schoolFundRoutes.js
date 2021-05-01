import { Router } from "express";
const router = Router();

import {
  getAllSchoolFunds,
  getSchoolFund,
  updateSchoolFund,
  deleteSchoolFund,
  createSchoolFund,
} from "../controllers/SchoolFundController.js";

router.route("/").get(getAllSchoolFunds).post(createSchoolFund);

router.route("/:id").get(getSchoolFund);

router.route("/:id").get(getSchoolFund).patch(updateSchoolFund).delete(deleteSchoolFund);

export default router;
