import { Router } from "express";
const router = Router();

import {
  createKnowledgeSharing,
  deleteKowledgeSharing,
  getAllKowledgeSharing,
  getKowledgeSharing,
  updateKowledgeSharing,
} from "../controllers/knowledgeSharingController.js";

router.route("/").get(getAllKowledgeSharing);
router.route("/").post(createKnowledgeSharing);
router.route("/:id").get(getKowledgeSharing);
router.route("/:id").put(updateKowledgeSharing);
router.route("/:id").delete(deleteKowledgeSharing);

export default router;
