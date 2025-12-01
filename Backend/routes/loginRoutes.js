import express from "express";
import { login } from "../controllers/loginControllers.js";
import { updateRating } from "../controllers/loginControllers.js";
import { signup } from "../controllers/SignupController.js";

const router = express.Router();

router.post("/", login);
router.post("/updateRating", updateRating);
router.post("/signup", signup);

export default router;