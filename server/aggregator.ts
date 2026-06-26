import { IMeasurement } from "./measurement";
import { writeEvent } from "./router";
import redisClient from "./redisClient";

class Aggregator {
  measurements: IMeasurement[];

  private timer: NodeJS.Timeout | null = null;

  private isShuttingDown = false;

  private activePromise: Promise<void> | null = null;

  constructor(measurements: IMeasurement[]) {
    this.measurements = measurements;
  }

  processMsg(minuteMap: Map<number, Array<any>>, message: string) {
    try {
      const data = JSON.parse(message);
      if (!data || !data.timestamp) {
        throw new Error("Missing timestamp");
      }
      data.timestamp = new Date(data.timestamp);
      if (Number.isNaN(data.timestamp.getTime())) {
        throw new Error("Invalid timestamp");
      }
      const minute = Math.floor(data.timestamp.getTime() / 60000) * 60000;
      let minuteBuffer = minuteMap.get(minute);
      if (minuteBuffer == null) {
        minuteBuffer = [];
        minuteMap.set(minute, minuteBuffer);
      }
      minuteBuffer.push(data);
    } catch (err) {
      console.error(
        "Aggregator: skipping corrupted message",
        message.slice(0, 100),
        err instanceof Error ? err.message : String(err),
      );
    }
  }

  async aggregateMeasurement(meas: IMeasurement, to: number) {
    const res = await redisClient.zRangeByScore(meas.getRedisRawDataKey(), 0, to);
    if (res.length === 0) return;

    const minuteMap: Map<number, Array<any>> = new Map();
    for (const item of res) {
      this.processMsg(minuteMap, item);
    }

    const now = Date.now();
    await Promise.all(
      [...minuteMap.keys()].map(async (minute) => {
        const agg = meas.aggregateRawData2Minute(minute, minuteMap.get(minute));
        const sagg = JSON.stringify(agg);
        await redisClient.xAdd("toStore", "*", { m: sagg, id: meas.getStationID() });
        await redisClient
          .multi()
          .zAdd(meas.getRedisTrendKey(), { score: minute, value: sagg })
          .zRemRangeByScore(meas.getRedisTrendKey(), 0, now - 3600000)
          .exec();
      }),
    );

    await redisClient.zRemRangeByScore(meas.getRedisRawDataKey(), 0, to);
    writeEvent(meas.getStationID(), "minute");
  }

  async aggregate() {
    if (this.isShuttingDown) return;
    const to = Date.now() - (Date.now() % 60000) - 1;
    console.info("Aggregate", new Date(to));

    this.activePromise = Promise.all(
      this.measurements.map((meas) => this.aggregateMeasurement(meas, to))
    ).then(() => {
      this.activePromise = null;
    }).catch((e) => {
      console.error("Aggregation error:", e);
      this.activePromise = null;
    });

    await this.activePromise;

    if (this.isShuttingDown) return;

    const toMinute = Date.now() % 60000;
    this.timer = setTimeout(() => this.aggregate(), 60000 - toMinute + 5000);
  }

  start = async () => {
    console.info("start aggregator");
    const toMinute = Date.now() % 60000;
    this.timer = setTimeout(() => this.aggregate(), 60000 - toMinute + 5000);
  };

  async shutdown() {
    console.info("Shutting down aggregator...");
    this.isShuttingDown = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.activePromise) {
      console.info("Waiting for active aggregations to complete...");
      await this.activePromise;
    }
    console.info("Aggregator shut down completed.");
  }
}

export default Aggregator;
