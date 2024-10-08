/* eslint-disable max-classes-per-file */
import { createClient, RedisClientType } from "redis";
import { IMeasurement } from "./measurement";
import { writeEvent } from "./router";

class Agregator {
  redis: RedisClientType;

  measurements: IMeasurement[];

  constructor(measurements: IMeasurement[]) {
    this.redis = createClient({
      url: "redis://localhost:6379",
    });
    this.measurements = measurements;
  }

  processMsg(minuteMap: Map<number, Array<any>>, message: string) {
    const data = JSON.parse(message);
    data.timestamp = new Date(data.timestamp);
    // console.info("------ DATA ", data);

    const minute = Math.floor(data.timestamp.getTime() / 60000) * 60000;
    let minuteBuffer = minuteMap.get(minute);
    if (minuteBuffer == null) {
      minuteBuffer = [];
      minuteMap.set(minute, minuteBuffer);
    }
    // console.info("---- ADD TO MIN ----", minute);
    minuteBuffer.push(data);
  }

  async aggregate() {
    const to = Date.now() - (Date.now() % 60000) - 1;
    console.info("Aggregate", new Date(to));
    for (const meas of this.measurements) {
      // eslint-disable-next-line no-await-in-loop
      const res = await this.redis.zRangeByScore(
        meas.getRedisRawDataKey(),
        0,
        to,
      );
      if (res.length > 0) {
        const minuteMap: Map<number, Array<any>> = new Map();
        for (const item of res) {
          this.processMsg(minuteMap, item);
        }

        for (const minute of minuteMap.keys()) {
          const agg = meas.aggregateRawData2Minute(
            minute,
            minuteMap.get(minute),
          );
          // console.info(agg);
          const sagg = JSON.stringify(agg);
          // eslint-disable-next-line no-await-in-loop
          const resxAdd = await this.redis.xAdd(
            "toStore",
            "*", // * = Let Redis generate a timestamp ID for this new entry.
            // Payload to add to the stream:
            {
              m: sagg,
              id: meas.getStationID(),
            },
          );
          console.info(resxAdd);

          const multi = this.redis.multi();
          const now = Date.now();

          multi.zAdd(meas.getRedisTrendKey(), {
            score: minute,
            value: sagg,
          });
          multi.zRemRangeByScore(meas.getRedisTrendKey(), 0, now - 3600000);
          multi.exec();
        }

        // eslint-disable-next-line no-await-in-loop
        const resrem = await this.redis.zRemRangeByScore(
          meas.getRedisRawDataKey(),
          0,
          to,
        );
        console.info("REM", resrem);

        // sse
        writeEvent(meas.getStationID(), "minute");
      }
    }
    const toMinute = Date.now() % 60000;
    setTimeout(() => this.aggregate(), 60000 - toMinute + 5000);
  }

  start = async () => {
    console.info("start agregator");
    await this.redis.connect();
    const toMinute = Date.now() % 60000;
    setTimeout(() => this.aggregate(), 60000 - toMinute + 5000);
  };
}

export default Agregator;
