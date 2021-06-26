import { Router } from "express";
const router = Router();

import {createPostCount, deletePostCount} from '../controllers/postCountController.js';


router.route("/like").post(createPostCount);
router.route("/dislike").delete(deletePostCount)

export default router;
