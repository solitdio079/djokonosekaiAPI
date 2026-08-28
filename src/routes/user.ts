import express, { Router } from "express";
import verifyIfAdmin from "../utils/verifyIfAdmin.js"
import {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  getUserComments,
  getUserPosts,
  updateRole
} from "../controllers/user.js";

const router = Router();

router.use(express.json());



router.get("/:userId/comments", getUserComments)

router.get("/:userId/posts", getUserPosts)

router.get("/:userId", getOneUser);
router.get("/", verifyIfAdmin,getAllUsers);
router.put("/:userId", updateUser);
router.put("/role/:userId", verifyIfAdmin,updateRole);

router.delete("/:userId", verifyIfAdmin,deleteUser);

export default router;
