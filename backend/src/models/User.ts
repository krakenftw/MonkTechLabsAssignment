import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee"], required: true },
  timezone: { type: String, required: true },
  availibilty: [
    {
      timezone: String,
      date: String,
      startTime: String,
      endTime: String,
    },
  ],
  shifts: [
    {
      date: String,
      startTime: String,
      endTime: String,
      timezone: String,
    },
  ],
});

const User = mongoose.model("user", UserSchema);

export default User;
