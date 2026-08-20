import express, { Router } from "express";

import {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  getUserComments,
  getUserPosts
} from "../controllers/user.js";

const router = Router();

router.use(express.json());



router.get("/:userId/comments", getUserComments)

router.get("/:userId/posts", getUserPosts)

router.get("/:userId", getOneUser);
router.get("/", getAllUsers);
router.put("/:userId", updateUser);

router.delete("/:userId", deleteUser);




export default router;
