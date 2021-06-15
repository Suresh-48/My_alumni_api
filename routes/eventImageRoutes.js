import { Router } from "express";
const router = Router();

import {updateEventImage, postEventImage,PastEventImage} from "../controllers/eventImageController.js";

router.route("/eventImage/").post(postEventImage);

router.route("/eventImage/:id").put(updateEventImage);

router.route("/pastimage/").get(PastEventImage);


export default router;