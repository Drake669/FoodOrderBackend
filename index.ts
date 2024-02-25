import express from "express";
import dbConnection from "./services/Database";
import expressApp from "./services/ExpressApp";

const StartServer = async () => {
  const app = express();
  await dbConnection();
  await expressApp(app);

  app.listen(8000, () => {
    console.log("App running on port 8000");
  });
};

StartServer();
