import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/jwt.js";
export const authToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(/\s+/)[1];
    if (!token)
        return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: err.message });
        }
        req.user = decoded;
        next();
    });
};
