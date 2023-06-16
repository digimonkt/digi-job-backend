import express from "express";
import mongoose from "mongoose";
import { config } from "./config/config";
import http from "http";
import { ROUTER } from "./routes";
import { verifyToken } from "./middleware/verify-token";
import { postVerify } from "./middleware/post-verify";
import { getUserDetailHandler } from "./user/controllers";
import cors from "cors";
import path from "path";

const app = express();

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const serverConfig = () => {
  console.log("Server configuration started");
  app.use(cors());

  app.use((req, res, next) => {
    console.log(
      `Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Method: [${req.method}]`
    );
    res.on("finish", () => {
      console.log(
        `Outgoing -> Status: [${res.statusCode}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Method: [${req.method}]`
      );
    });
    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/public", express.static(path.join(process.cwd(), "public")));
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Access, X-Refresh"
    );
    res.setHeader("Access-Control-Expose-Headers", "X-Access, X-Refresh");
    next();
  });

  app.use(verifyToken);

  app.use("/ping", (req, res) => {
    return res.status(200).json({ message: "pong" });
  });

  for (const route of ROUTER) {
    console.log(`Loading route ${route.path}`);
    app.use(`/api/v1${route.path}`, route.router);
  }

  app.use((req, res) => {
    return res.status(404).json({ message: "Not found" });
  });

  http
    .createServer(app)
    .listen(config.server.port, () =>
      console.log(
        `Express is listening at http://localhost:${config.server.port}`
      )
    );
};

serverConfig();
