import express, { Router } from "express";
import passport from "passport"
import verifyIfAdmin from "../utils/verifyIfAdmin.js"
import {
  getAllPosts,
  getOnePost,
  updatePost,
  createPost,
  deletePost,
  getPostComments
} from "../controllers/post.js";

import "../utils/passportJwt.js"

const router = Router();

router.use(express.json());

router.get("/:postId/comments", getPostComments)
router.get("/:postId", getOnePost);

router.use(passport.authenticate('jwt', {session:false}))
router.get("/", verifyIfAdmin,getAllPosts);
router.post("/", verifyIfAdmin, createPost);

router.put("/:postId", verifyIfAdmin,updatePost);

router.delete("/:postId", verifyIfAdmin,deletePost);

export default router;
