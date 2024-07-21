import { Request, Response } from "express";

export const isAdmin = (req: Request, res: Response, next: Function) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Access denied" });
  }
};
