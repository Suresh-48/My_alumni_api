import { Router } from "express";

import csvFileUpload from "../csvFileUpload.js";

const router = Router();

import {getAllColleges,getCollege,updateCollege,deleteCollege,createCollege, addCollege, ListUsersFromCollege, ListCollegesFromUser, updateCollegeAvatar, getCollegeLists} from '../controllers/collegeController.js'

router.route("/").get(getAllColleges);

router.route("/").post(createCollege);

router.route("/user").get(ListUsersFromCollege);

router.route("/user/college").get(ListCollegesFromUser);

router.route("/avatar/:id").put(updateCollegeAvatar);

router.route("/lists").get(getCollegeLists);

router.route("/:id").get(getCollege).patch(updateCollege).delete(deleteCollege);

router.post("/addCollege", csvFileUpload,addCollege);

export default router;

