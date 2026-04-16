import http from "http";
import { AddressInfo } from "net";
import app from "./app";
import Aggregator from "./aggregator";
import { allStationsCfg } from "./state";
import { Dom } from "./dom";
import redisClient from "./redisClient";

const dom = new Dom();

redisClient.connect().catch((err) => {
  console.error("Fatal: failed to connect to Redis:", err);
  process.exit(1);
});

allStationsCfg
  .readCfg()
  .then(() => {
    const measurements = allStationsCfg.getMeasurements();
    measurements.push(dom);
    const aggregator = new Aggregator(measurements);
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
