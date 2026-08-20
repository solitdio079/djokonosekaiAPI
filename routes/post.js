import express, { Router } from "express";
import {
  getAllPosts,
  getOnePost,
  updatePost,
  createPost,
  deletePost,
  getPostComments
} from "../controllers/post.js";

const router = Router();

router.use(express.json());

router.get("/:postId/comments", getPostComments)
router.get("/:postId", getOnePost);
router.get("/", getAllPosts);
router.post("/", createPost);

router.put("/:postId", updatePost);

router.delete("/:postId", deletePost);

export default router;
