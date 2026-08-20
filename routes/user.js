import express, { Router } from "express";

import {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
} from "../controllers/user.js";

const router = Router();

router.use(express.json());

router.get("/", getAllUsers);

router.get("/:userId", getOneUser);

router.put("/:userId", updateUser);

router.delete("/:userId", deleteUser);

export default router;
