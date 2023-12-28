/* eslint-disable max-classes-per-file */
import { createClient, RedisClientType } from "redis";
import { IMeasurement } from "./measurement";

class Agregator {
  redis: RedisClientType;

  measurements: IMeasurement[];

  constructor(measurements: IMeasurement[]) {
    this.redis = createClient();
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

  async agregate() {
    const to = Date.now() - (Date.now() % 60000) - 1;
    console.info(new Date(to));
    for (const meas of this.measurements) {
      // eslint-disable-next-line no-await-in-loop
      const res = await this.redis.zRange(meas.getRedisRawDataKey(), 0, to);
      const minuteMap: Map<number, Array<any>> = new Map();
      for (const item of res) {
        this.processMsg(minuteMap, item);
      }

      // console.info(minuteMap);

      for (const minute of minuteMap.keys()) {
        const agg = meas.agregateRawData2Minute(
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

      const redisTrendKey = meas.getRedisTrendKey();
      const now = Date.now();
      // eslint-disable-next-line no-await-in-loop
      const rest = await this.redis.zRangeByScore(
        redisTrendKey,
        now - 3600000,
        now,
      );
      const transformed = meas.transformTrendData(rest);
      console.info(transformed);
      // this.socketEmitter.emit(measurement.getSocketTrendChannel(), transformed);

      // eslint-disable-next-line no-await-in-loop
      const resrem = await this.redis.zRemRangeByScore(
        meas.getRedisRawDataKey(),
        0,
        to,
      );
      console.info("REM", resrem);
    }
    const toMinute = Date.now() % 60000;
    setTimeout(() => this.agregate(), 60000 - toMinute + 5000);
  }

  start = async () => {
    console.info("start agregator");
    await this.redis.connect();
    const toMinute = Date.now() % 60000;
    setTimeout(() => this.agregate(), 60000 - toMinute + 5000);
  };
}

export default Agregator;
