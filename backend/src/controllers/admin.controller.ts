import { Request, Response } from "express";
import User from "../models/User";

export const adminGetAvailibilty = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "employee" }).select(
      "username availibilty timezone",
    );
    res.json({ data: users });
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllUsersWithAvailibilty = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.find({}, { password: 0 }).exec();

    res.status(200).json(users);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getUsersWithTime = async (req: Request, res: Response) => {
  const { date, startTime, endTime } = req.body;
  if (!date || !startTime || !endTime) {
    return res.status(400).json({ msg: "All fields required" });
  }

  try {
    const allData = await User.find({ role: "employee" });

    const shiftStart = new Date(`${date}T${startTime}:00.000Z`).getTime();
    const shiftEnd = new Date(`${date}T${endTime}:00.000Z`).getTime();

    const filteredData = allData.filter((each) => {
      return each.availibilty.some((availibilty) => {
        const availableStart = new Date(availibilty.startTime!).getTime();
        const availableEnd = new Date(availibilty.endTime!).getTime();

        console.log(shiftStart >= availableStart && shiftEnd <= availableEnd);
        return shiftStart >= availableStart && shiftEnd <= availableEnd;
      });
    });

    return res.json({ data: filteredData });
  } catch (error) {
    console.error("Error fetching users with time:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const getAvailibiltyByEmployeeId = async (
  req: Request,
  res: Response,
) => {
  const { employeeId } = req.params;
  const { timezone } = req.query as { timezone?: string };

  try {
    const user = await User.findById(employeeId).exec();
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let availibilty: any = user.availibilty;

    res.json(availibilty);
  } catch (err) {
    console.error("Failed to fetch availibilty", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const adminCreateShift = async (req: Request, res: Response) => {
  const { userId, date, startTime, endTime, timezone } = req.body;

  if (!userId || !date || !startTime || !endTime || !timezone) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    console.log(user)

    const newShiftStart = new Date(`${date}T${startTime}:00.000Z`).getTime();
    const newShiftEnd = new Date(`${date}T${endTime}:00.000Z`).getTime();

    const isClashing = user.shifts.some((shift) => {
      const existingShiftStart = new Date(
        `${shift.date}T${shift.startTime}:00.000Z`
      ).getTime();
      const existingShiftEnd = new Date(
        `${shift.date}T${shift.endTime}:00.000Z`
      ).getTime();

      return (
        (newShiftStart >= existingShiftStart && newShiftStart < existingShiftEnd) ||
        (newShiftEnd > existingShiftStart && newShiftEnd <= existingShiftEnd) ||
        (newShiftStart <= existingShiftStart && newShiftEnd >= existingShiftEnd)
      );
    });

    if (isClashing) {
      return res.status(400).json({ msg: "Shift times overlap with existing shifts" });
    }

    const shift = {
      date,
      startTime,
      endTime,
      timezone,
    };

    user.shifts.push(shift);

    await user.save();

    res.status(200).json({ msg: "Shift created successfully", shifts: user.shifts });
  } catch (err) {
    console.error("Error creating shift:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
