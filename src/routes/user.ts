import express, { Router } from "express";
import verifyIfAdmin from "../utils/verifyIfAdmin.js"
import {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  getUserComments,
  getUserPosts,
  updateRole,
  validateUpdateUserData,
  validateUserRole
} from "../controllers/user.js";

const router = Router();

router.use(express.json());



router.get("/:userId/comments", getUserComments)

router.get("/:userId/posts", getUserPosts)

router.get("/:userId", getOneUser);
router.get("/", verifyIfAdmin,getAllUsers);
router.put("/:userId", validateUpdateUserData,updateUser);
router.put("/role/:userId", validateUserRole,verifyIfAdmin,updateRole);

router.delete("/:userId", verifyIfAdmin,deleteUser);

export default router;
