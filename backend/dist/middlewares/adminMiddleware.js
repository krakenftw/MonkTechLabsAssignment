"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === "admin") {
        next();
    }
    else {
        res.status(403).json({ msg: "Access denied" });
    }
};
exports.isAdmin = isAdmin;
