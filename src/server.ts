import express from "express";
import helmet from "helmet";
import cors from "cors";
import mainRouter from "./routes/index.js";

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors())

server.use("/", mainRouter);

server.listen(1000, () => {
  console.log("Server is on at http://localhost:1000");
});
