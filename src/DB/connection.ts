import mongoose from "mongoose";
import { DB_URL } from "../config";

export function connectDB() {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("DB connected successfully.");
    })
    .catch((err) => console.log("Fail to connect to DB."));
}
