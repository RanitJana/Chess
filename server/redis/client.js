import { Redis } from "ioredis";
import { _env } from "../constants.js";

const client = new Redis(_env.REDIS_URI);

client
  .on("connect", () => {
    console.log("Connected to Redis");
  })
  .on("error", (err) => {
    console.error("Redis error:", err);
  });

export default client;
