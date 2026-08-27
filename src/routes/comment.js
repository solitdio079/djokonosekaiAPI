import express, {Router} from "express"
import {createComment, updateComment, deleteComment} from "../controllers/comment.js"
const router = Router()

router.use(express.json())

router.post("/", createComment)

router.put("/:commentId", updateComment)

router.delete("/:commentId", deleteComment)


export default router