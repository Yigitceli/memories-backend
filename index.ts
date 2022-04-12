import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import indexRouter from "./routes/index";
import mongoose from "mongoose";
import cors from "cors";
import "./firebaseInıt";

dotenv.config();
const port = process.env.PORT;
const app: Express = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", indexRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, async () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then((result) => console.log("MONGODB CONNECTED"));
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
