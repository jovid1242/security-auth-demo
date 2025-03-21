const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1]; 

    if (!token) {
        token = req.query.token; 
    }

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

const authorize = (role) => {
    return (req, res, next) => {
        if (req.user?.role !== role) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
