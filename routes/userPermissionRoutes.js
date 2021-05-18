import { Router } from "express";
const router = Router();

// UserPermission Controller
import {
  getAllUserPermissions,
  getUserPermission,
  updateUserPermission,
  deleteUserPermission,
  createUserPermissions,
} from "../controllers/userPermissionController.js";

router.route("/").get(getAllUserPermissions).post(createUserPermissions);

router.route("/:id").get(getUserPermission).patch(updateUserPermission).delete(deleteUserPermission);

export default router;
