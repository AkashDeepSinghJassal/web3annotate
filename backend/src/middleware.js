import jwt from "jsonwebtoken";

export function userMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"] ?? "";

    try {
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
        console.log(decoded);
        if (decoded.userId) {
            req.userId = decoded.userId;
            return next();
        } else {
            return res.status(403).json({
                message: "You are not logged in"
            })    
        }
    } catch(e) {
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
}

export function workerMiddleware(req, res, next) { 
    const authHeader = req.headers["authorization"] ?? "";

    console.log(authHeader);
    try {
        const decoded = jwt.verify(authHeader, WORKER_JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId;
            return next();
        } else {
            return res.status(403).json({
                message: "You are not logged in"
            })    
        }
    } catch(e) {
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
}