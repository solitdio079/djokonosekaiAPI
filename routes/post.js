import express, { Router } from "express";
import {
  getAllPosts,
  getOnePost,
  updatePost,
  createPost,
  deletePost,
} from "../controllers/post.js";

const router = Router();

router.use(express.json());

router.get("/", getAllPosts);
router.get("/:postId", getOnePost);

router.post("/", createPost);

router.put("/:postId", updatePost);

router.delete("/:postId", deletePost);

export default router;
