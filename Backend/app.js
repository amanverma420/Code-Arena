import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import loginRoutes from "./routes/loginRoutes.js";
import lobbyRoutes from "./routes/lobbyRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

app.use("/api/login", loginRoutes);
app.use("/api/lobby", lobbyRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});