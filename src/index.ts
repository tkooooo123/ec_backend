import express from "express";
import { config } from "./config/env";
import connectDB from "./config/db";
import routes from "./routes";

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(express.json());
  app.use("/api", routes);

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

startServer();