import { Router } from "express";
const router = Router();
// User Controller
import {
  deleteMe,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getGroups,
  updateAvatar,
  deleteAvatarImage,
  checkingUser,
} from "../controllers/userController.js";
// Auth Controller
import { login, signup, protect, restrictTo } from "./../controllers/authController.js";
//router.use(protect);
//----------------------------------------------------->
//=============================>
router.post("/login", login);
router.post("/signup", signup);
// Protect all routes after this middleware
router.delete("/deleteMe", deleteMe);
// Only admin have permission to access for the below APIs
// router.use(restrictTo('admin'));
router.route("/").get(getAllUsers);


router.route("/check").post(checkingUser);


router.route("/avatar/:id").put(updateAvatar);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
router.route("/:id/groups").get(getGroups);

router.route("/deleteAvatarImage/:id").put(deleteAvatarImage);

export default router;
