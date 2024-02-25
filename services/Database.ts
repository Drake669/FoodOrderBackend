import mongoose, { ConnectOptions } from "mongoose";
import { CONNECTION_URL } from "../config";

export default async () => {
  try {
    await mongoose.connect(CONNECTION_URL);
    console.log("Database connected succesfully");
  } catch (error) {
    console.log(error);
  }
};
