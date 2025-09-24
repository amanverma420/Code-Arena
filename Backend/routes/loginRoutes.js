import express from "express";
import {
  login
} from "../controllers/loginControllers.js";

const router = express.Router();

router.get("/", login);

export default router;