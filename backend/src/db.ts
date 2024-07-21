import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

function dbConnect(): void {
  mongoose
    .connect(process.env.DATABASE_URL!)
    .then((): void => console.log("DB connected"))
    .catch((err: any): void => console.log(err));
}

export default dbConnect;
