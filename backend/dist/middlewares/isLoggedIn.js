"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    }
    else {
        res.status(403).json({ msg: "Access denied" });
    }
};
exports.isLoggedIn = isLoggedIn;
