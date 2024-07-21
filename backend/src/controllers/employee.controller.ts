import { resolve4 } from "dns";
import { Request, Response } from "express";
import User from "../models/User";

export async function getavailibilty(req: Request, res: Response) {
  try {
    const user = await User.findById(req.session.user?.id);
    if (!user) {
      res.status(401).json({ msg: "user not found" });
      return;
    }
    res.json(user.availibilty);
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

export async function getShifts(req: Request, res: Response) {
  try {
    const user = await User.findById(req.session.user?.id);
    if (!user) {
      res.status(401).json({ msg: "user not found" });
      return;
    }
    res.json(user.shifts);
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

export async function createavailibilty(req: Request, res: Response) {
  try {
    const { startTime, endTime, date, timezone } = req.body;
    if (!startTime || !endTime || !date || !timezone) {
      res.status(400).json({ msg: "All fields required" });
      return;
    }
    console.log(req.session);
    const user = await User.findById(req.session?.user?.id);
    if (!user) {
      res.status(401).json({ msg: "user not found" });
      return;
    }

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);

    const durationInHours = endTimeDate.getTime() - startTimeDate.getTime();

    if (durationInHours < 4) {
      res.status(406).json({ msg: "Minimum 4 hour shift required" });
      return;
    }

    user.availibilty.push({
      date,
      startTime,
      endTime,
      timezone,
    });

    await user.save();

    res.status(200).json({ availibilty: user.availibilty });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
