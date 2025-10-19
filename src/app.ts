import express from "express";
import morgan from "morgan";
import cors from "cors";
import apiRouter from "./api.routes";
import { setupSwagger } from "./swagger";

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
setupSwagger(app);

export default app;