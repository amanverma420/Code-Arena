import express from "express";
import {
  lobbyCreate,
  lobbyJoin
} from "../controllers/lobbyControllers.js";

const router = express.Router();

router.get("/create", lobbyCreate);
router.get("/join", lobbyJoin);

export default router;