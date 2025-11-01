import express from "express";
import { login } from "../controllers/loginControllers.js";
import { signup } from "../controllers/SignupController.js";

const router = express.Router();

router.post("/", login);

router.post("/signup", signup);

export default router;