import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";

import {
  listAllUsers, getUsersByID, registerUser, login, updateUser, forgetPassword, resetPassword,
  deactiviateUser, refreshAccessToken
} from "../controllers/auth.controller";


//*********** Login, register & verification ***********//
router.post("/register", registerUser);
router.get("/auth/user/get/:id", requireAuth, getUsersByID);
router.get("/auth/users", listAllUsers);
router.put("/auth/user/update/:id", requireAuth, updateUser);
router.post("/auth", login);
router.post("/auth/forget-password", forgetPassword);
router.post("/auth/reset-password/:token", resetPassword);
router.post("/auth/refresh", refreshAccessToken);

//*********** New Routes for Social Media Authentication ***********//


export default router;
