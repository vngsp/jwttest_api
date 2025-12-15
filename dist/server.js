import express from "express";
import helmet from "helmet";
import cors from "cors";
import mainRouter from "./routes/index.js";
const allowedOrigins = [
    "http://localhost:3000",
    "https://jwttest-front-sx58.vercel.app"
];
const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
server.options(/.*/, cors());
server.use("/", mainRouter);
server.listen(1000, () => {
    console.log("Server is on at http://localhost:1000");
});
