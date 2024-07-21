import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

export const handleUserRegister = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username, password, role, timezone } = req.body;
  if (!username || !password || !role || !timezone) {
    res.status(401).json({ msg: "All fields required" });
    return;
  }
  try {
    let user = await User.findOne({ username });
    if (user) {
      res.status(400).json({ msg: "User already exists" });
      return;
    }

    user = new User({ username, password, role, timezone });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    req.session.user = { id: user.id, role: user.role };
    res.json({ msg: "User registered successfully" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const handleUserLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(402).json({ msg: "All fields required" });
    return;
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ msg: "Invalid Credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ msg: "Invalid Credentials" });
      return;
    }

    req.session.user = { id: user.id, role: user.role };
    req.session.save();

    res.json({ msg: "User logged in successfully" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  console.log(req.session);
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
};

export const handleUserLogout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to destroy session during logout", err);
      res.status(500).json({ msg: "Failed to log out" });
      return;
    }
    res.status(200).json({ msg: "User logged out successfully" });
  });
};
