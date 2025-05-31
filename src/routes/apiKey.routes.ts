import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";

import { listApiKey, createApiKey, deactiveKey } from "../controllers/apiKey.controller";


//*********** ALL APP ROUTES ***********//
router.get("/api-key/list", requireAuth, listApiKey);
router.post("/api-key/create", requireAuth, createApiKey);
router.post("/api-key/deactive", requireAuth, deactiveKey);

export default router;
