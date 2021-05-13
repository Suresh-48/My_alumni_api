import { Router } from "express";
const router = Router();

// UserVote Controller
import {
  getAllUserVotes,
  getUserVote,
  updateUserVote,
  deleteUserVote,
  createUserVotes,
} from "../controllers/userVoteController.js";

router.route("/").get(getAllUserVotes).post(createUserVotes);

router.route("/:id").get(getUserVote).patch(updateUserVote).delete(deleteUserVote);

export default router;
