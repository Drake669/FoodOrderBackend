import express from "express";
import dbConnection from "./services/Database";
import expressApp from "./services/ExpressApp";
import { PORT } from "./config";

const StartServer = async () => {
  const app = express();
  await dbConnection();
  await expressApp(app);

  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
};

StartServer();
