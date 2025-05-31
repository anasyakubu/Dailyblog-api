import express from "express";
import authRoutes from "./auth.routes";
import ApiOverview from "./apiOverview.routes";

const router = express.Router();

//********************** Routes Setup **********************//
router.use("/", authRoutes);
router.use("/", ApiOverview);

export default router;
