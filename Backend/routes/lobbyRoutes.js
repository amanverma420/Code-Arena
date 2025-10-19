import express from "express";
import {
  lobbyCreate,
  lobbyJoin
} from "../controllers/lobbyControllers.js";

const router = express.Router();

router.post("/create", lobbyCreate);
router.post("/join", lobbyJoin);

export default router;