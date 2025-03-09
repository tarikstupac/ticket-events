import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";
import mongoose from "mongoose";

const dbURI =
  `mongodb://${env.DB_USERNAME}:${env.DB_PASSWORD}@mongo_rs0:27017,mongo_rs1:27018,mongo_rs2:27019/${env.DB_NAME}?replicaSet=rs0` as const;

const options = {
  autoIndex: true,
  maxPoolSize: 300, // Max open sockets for connection
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  authSource: env.DB_NAME,
};

const startServer = async () => {
  try {
    await mongoose.connect(dbURI, options);
    logger.info("Mongoose connection done");

    const server = app.listen(env.PORT, () => {
      const { NODE_ENV, HOST, PORT } = env;
      logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
    });

    const onCloseSignal = () => {
      logger.info("sigint received, shutting down");
      mongoose.connection.close().then(() => {
        logger.info("Mongoose connection closed");
        server.close(() => {
          logger.info("server closed");
          process.exit();
        });
      });
      setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
    };

    process.on("SIGINT", onCloseSignal);
    process.on("SIGTERM", onCloseSignal);
  } catch (e) {
    logger.info("Mongoose connection error");
    logger.error(e);
    process.exit(1); // Exit the process with failure
  }
};

startServer();
