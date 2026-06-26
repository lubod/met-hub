import http from "http";
import { AddressInfo } from "net";
import app from "./app";
import Aggregator from "./aggregator";
import { allStationsCfg } from "./state";
import { dom } from "./dom";
import redisClient from "./redisClient";

redisClient.connect().catch((err) => {
  console.error("Fatal: failed to connect to Redis:", err);
  process.exit(1);
});

let aggregator: Aggregator | null = null;

allStationsCfg
  .readCfg()
  .then(() => {
    const measurements = allStationsCfg.getMeasurements();
    measurements.push(dom);
    aggregator = new Aggregator(measurements);
    aggregator.start();
  })
  .catch((err) => {
    console.error("Failed to read station config:", err);
  });

const httpServer = http.createServer(app);
const server = httpServer.listen(8089, "0.0.0.0", () => {
  const addr = server.address() as AddressInfo;
  console.log("Listening at ", addr);
});

async function gracefulShutdown(signal: string) {
  console.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(() => {
    console.info("HTTP server closed.");
  });

  if (aggregator) {
    try {
      await aggregator.shutdown();
    } catch (err) {
      console.error("Error shutting down aggregator:", err);
    }
  }

  try {
    await redisClient.disconnect();
    console.info("Redis client disconnected.");
  } catch (err) {
    console.error("Error disconnecting Redis:", err);
  }

  console.info("Graceful shutdown finished. Exiting process.");
  process.exit(0);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
