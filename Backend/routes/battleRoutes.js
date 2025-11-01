  import express from "express";
  import {  
    allocateProblem,
  } from "../controllers/battleControllers.js";

  const router = express.Router();

  router.post("/allocate", allocateProblem);

  export default router;