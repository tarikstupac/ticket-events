import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";
import { createClient } from "redis";

export const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 20) {
        console.log("Too many attempts to reconnect. Redis connection was terminated");
        return new Error("Too many retries.");
      } else {
        return retries * 500;
      }
    },
    connectTimeout: 10000, // 10 seconds
  },
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

redisClient.on("error", (err) => {
  logger.error("Redis Client Error", err);
});
