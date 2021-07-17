import { Router } from "express";

import csvFileUpload from "../csvFileUpload.js";
const router = Router();

import {getAllColleges,getCollege,updateCollege,deleteCollege,createCollege, addCollege} from '../controllers/collegeController.js'

router.route("/").get(getAllColleges);

router.route("/").post(createCollege);

router.route("/:id").get(getCollege).patch(updateCollege).delete(deleteCollege);

router.post("/addCollege", csvFileUpload,addCollege);

export default router;

