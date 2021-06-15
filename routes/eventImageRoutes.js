import { Router } from "express";
const router = Router();

import {updateEventImages, updateEventImage} from "../controllers/eventImageController.js";

router.route("/eventImage/").post(updateEventImages);

router.route("/eventImage/:id").put(updateEventImage);

export default router;