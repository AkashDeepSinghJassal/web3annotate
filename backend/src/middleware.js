import jwt from "jsonwebtoken";
import config from "./config/index.js";

export function userMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"] ?? "";

    try {
        const decoded = jwt.verify(authHeader, config.jwt.secret);
        console.log(`user jwt ${JSON.stringify(decoded)}`);
        if (decoded.userId) {
            req.userId = decoded.userId;
            return next();
        } else {
            return res.status(403).json({
                message: "You are not logged in"
            })    
        }
    } catch(e) {
        console.error(e);
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
}

export function workerMiddleware(req, res, next) { 
    const authHeader = req.headers["authorization"] ?? "";

    try {
        const decoded = jwt.verify(authHeader, config.jwt.workerSecret);
        if (decoded.userId) {
            req.userId = decoded.userId;
            return next();
        } else {
            return res.status(403).json({
                message: "You are not logged in"
            })    
        }
    } catch(e) {
        console.error(e);
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
}