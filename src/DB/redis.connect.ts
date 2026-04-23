import { createClient } from "redis";
import { REDIS_URL } from "../config";

export const redisClient = createClient({
  url: REDIS_URL,
});

export const redisConnect = () => {
  redisClient
    .connect()
    .then(() => {
      console.log("Redis connected Successfully");
    })
    .catch((err) => {
      console.log("Fail to connect to database.");
    });
};
