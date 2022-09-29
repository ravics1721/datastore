import { config } from "dotenv";
config();
import express from "express";
import morgan from "morgan";
import router from "./api.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL);

app.use(express.json());
app.use(morgan("dev"));
app.use(cors())
const port = process.env.PORT || 5050;

app.get("/", (req, res) => {
  res.json({
    message: "Hello There",
  });
});

app.use("/api", router);

app.get("/*", (req, res) => {
  res.json({ message: "NOT FOUND" });
});

app.listen(port, () => {
  console.log(`[Server]: is running on http://localhost:${port}`);
});
