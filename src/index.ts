import express from "express";
import { config } from "./config/env";
import connectDB from "./config/db";
 

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(express.json());

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

startServer();