import { Request, Response } from "express";

export const isLoggedIn = (req: Request, res: Response, next: Function) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(403).json({ msg: "Access denied" });
    }
};
