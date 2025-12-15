import express from "express";
import helmet from "helmet";
import cors from "cors";
import mainRouter from "./routes/index.js";

const server = express();

server.use(express.json());
server.use(helmet());

server.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "https://jwttest-front.vercel.app"
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

server.use("/", mainRouter);

server.listen(1000, () => {
  console.log("Server is on at http://localhost:1000");
});
