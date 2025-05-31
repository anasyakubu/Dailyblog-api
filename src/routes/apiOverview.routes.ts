import { Router } from "express";
import { apiOverview } from "../controllers/apiOverview.controller";

const router = Router();

// Default API overview route
router.get("/", apiOverview);

export default router;
