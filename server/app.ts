import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";
import path from "path";
import router from "./router";
import { AppError } from "./state";

const app = express();
app.set("trust proxy", 1);
const helmet = require("helmet");
const csp = require("helmet-csp");

const publicDirectoryPath = path.join(__dirname, "html");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(
  csp({
    directives: {
      defaultSrc: [`'self'`],
      scriptSrc: [`'self'`, `*.google.com`, `*.chatademian.com`],
      frameSrc: [`'self'`, `*.google.com`, `*.chatademian.com`],
      connectSrc: [`'self'`, `*.google.com`],
      imgSrc: [`'self'`, `*.openstreetmap.org`, `unpkg.com`, `data:`],
      frameAncestors: [`'self'`, `*.chatademian.com`],
    },
  }),
);

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:8089";
app.use(cors({ origin: corsOrigin, credentials: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(publicDirectoryPath));

// Health check is before the rate limiter so it doesn't count against limits
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "html/index.html"));
});

app.use(router);

// eslint-disable-next-line no-unused-vars
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR:", err.code, err.msg ?? err.message, err.stack);
  res.status(err.code || 500).json({ code: err.code, msg: err.msg ?? err.message });
});

export default app;
