import { Router } from "express";
const router = Router();

import { updateEventImage, postEventImage, PastEventImage } from "../controllers/eventImageController.js";

router.route("/").post(postEventImage);

router.route("/:id").put(updateEventImage);

router.route("/").get(PastEventImage);

export default router;
