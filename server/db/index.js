import { connect } from "mongoose";
import { _env } from "../constants.js";

const connectDB = async () => {
  try {
    await connect(`${_env.MONGODB_URI}/${_env.DB_NAME}`);
  } catch (error) {
    console.log("DB connection error : \n", error);
  }
};

export default connectDB;
