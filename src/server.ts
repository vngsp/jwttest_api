import express from 'express';
import helmet from 'helmet';
import mainRouter from './routes';
import cors from 'cors';

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}))

server.use('/', mainRouter);

server.listen(1000, () => {
    console.log("Server is on at http://localhost:1000");
})