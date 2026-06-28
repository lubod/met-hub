import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import router from "./router";
import { AppError } from "./state";

const app = express();
app.set("trust proxy", 1);

const publicDirectoryPath = path.join(__dirname, "html");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

// GoGen ME 3900 posts every ~16s → ~38 req/10min per station.
// A user can have up to 3 stations → ~113 req/10min. 600 gives ~5x headroom.
const ingestMax = parseInt(process.env.INGEST_RATE_LIMIT || "", 10) || 600;
const ingestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: ingestMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: 429, msg: "Too many ingestion requests from this IP" },
});

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [`'self'`],
      scriptSrc: [`'self'`, `*.google.com`, `*.chatademian.com`],
      frameSrc: [`'self'`, `*.google.com`, `*.chatademian.com`],
      connectSrc: [`'self'`, `*.google.com`],
      imgSrc: [`'self'`, `*.openstreetmap.org`, `unpkg.com`, `data:`],
      frameAncestors: [`'self'`, `*.chatademian.com`],
      workerSrc: [`'self'`, `blob:`],
    },
  }),
);

const corsOrigin = process.env.CORS_ORIGIN;
if (!corsOrigin && process.env.ENV !== "dev") {
  throw new Error("CORS_ORIGIN environment variable is not set");
}
const finalCorsOrigin = corsOrigin || "http://localhost:8089";
app.use(cors({ origin: finalCorsOrigin, credentials: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(cookieParser());
app.use(express.json({ limit: "32kb" }));
app.use(express.static(publicDirectoryPath));

// Health check is before the rate limiter so it doesn't count against limits
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use("/setData", ingestLimiter);
app.use("/setDomData", ingestLimiter);
app.use("/weatherstation/updateweatherstation.php", ingestLimiter);
app.use("/data/report", ingestLimiter);
app.use("/api/ingest", ingestLimiter);

app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "html/index.html"));
});

app.use(router);

// eslint-disable-next-line no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const code = err.code || err.status || err.statusCode || 500;
  console.error("ERROR:", code, err.msg ?? err.message, err.stack);
  res.status(code).json({ code, msg: err.msg ?? err.message });
});

export default app;
