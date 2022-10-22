import { createClient, RedisClientType } from "redis";
import { IMeasurement } from "./measurement";
import SocketEmitter from "./socketEmitter";

class Agregator {
  redis: RedisClientType;

  redisPub: RedisClientType;

  measurements: IMeasurement[];

  socketEmiter: SocketEmitter;

  constructor(socketEmiter: SocketEmitter, measurements: IMeasurement[]) {
    this.redis = createClient();
    this.redisPub = createClient();
    this.measurements = measurements;
    this.socketEmiter = socketEmiter;
  }

  start = async () => {
    console.info("start agregator");
    await this.redis.connect();
    await this.redisPub.connect();
    const toMinute = Date.now() % 60000;
    setTimeout(() => this.agregator(), 60000 - toMinute);
  };

  agregator = async () => {
    for (const measurement of this.measurements) {
      const redisMinuteDataKey = measurement.getRedisMinuteDataKey();
      console.log(redisMinuteDataKey);
      // eslint-disable-next-line no-await-in-loop
      const result = await this.redis.zRangeByScore(
        redisMinuteDataKey,
        0,
        Number.MAX_VALUE
      );

      if (result.length > 0) {
        // console.info(result);
        try {
          const map = measurement.agregateMinuteData(result);
          const multi = this.redis.multi();
          const msg: any[] = [];
          const now = Date.now();

          map.forEach((avg: any, minute: number) => {
            multi.zAdd(measurement.getRedisTrendKey(), {
              score: minute,
              value: JSON.stringify(avg),
            });
            msg.push(avg);
          });
          multi.zRemRangeByScore(
            measurement.getRedisTrendKey(),
            0,
            now - 3600000
          );
          multi.exec();
          this.redisPub.publish(
            measurement.getRedisStoreChannel(),
            JSON.stringify(msg)
          );
          const redisTrendKey = measurement.getRedisTrendKey();
          // eslint-disable-next-line no-await-in-loop
          const res = await this.redis.zRangeByScore(
            redisTrendKey,
            now - 3600000,
            now
          );
          const transformed = measurement.transformTrendData(res);
          this.socketEmiter.emit(
            measurement.getSocketTrendChannel(),
            transformed
          );
        } catch (e) {
          console.error(e, result);
        } finally {
          this.redis.zRemRangeByScore(
            measurement.getRedisMinuteDataKey(),
            0,
            Number.MAX_VALUE
          );
        }
      }
    }

    const toMinute = Date.now() % 60000;
    setTimeout(() => this.agregator(), 60000 - toMinute);
  };
}

export default Agregator;
