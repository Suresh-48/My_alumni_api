import { Router } from "express";
const router = Router();

// UserVote Controller
import {
  getAllUserVotes,
  getUserVote,
  updateUserVote,
  deleteUserVote,
  createUserVotes,
  voteCreatedByUser,
} from "../controllers/userVoteController.js";

router.route("/").get(getAllUserVotes).post(createUserVotes);

router.route("/voted").get(voteCreatedByUser);

router.route("/:id").get(getUserVote).patch(updateUserVote).delete(deleteUserVote);

export default router;
