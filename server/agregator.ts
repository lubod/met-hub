import redis from 'redis';
import Station from './station';
import { Dom } from './dom';
import { IMeasurement } from './measurement';
import SocketEmitter from './socketEmitter';

class Agregator {
  redis: redis.RedisClient;

  redisPub: redis.RedisClient;

  measurements: IMeasurement[];

  socketEmiter: SocketEmitter;

  constructor(socketEmiter: SocketEmitter) {
    this.redis = redis.createClient();
    this.redisPub = redis.createClient();
    this.measurements = [new Station(), new Dom()];
    this.socketEmiter = socketEmiter;
  }

  start = () => {
    console.info('start agregator');
    const toMinute = Date.now() % 60000;
    setTimeout(() => this.agregator(), 60000 - toMinute);
  };

  agregator = () => {
    for (const measurement of this.measurements) {
      const redisMinuteDataKey = measurement.getRedisMinuteDataKey();
      console.log(redisMinuteDataKey);
      this.redis.zrangebyscore(redisMinuteDataKey, 0, Number.MAX_VALUE, (err: any, result: any) => {
        if (result.length > 0) {
          // console.info(result);
          try {
            const map = measurement.agregateMinuteData(result);
            const multi = this.redis.multi();
            const msg: any[] = [];
            const now = Date.now();

            map.forEach((avg: any, minute: string | number) => {
              multi.zadd(measurement.getRedisTrendKey(), minute, JSON.stringify(avg));
              msg.push(avg);
            });
            multi.zremrangebyscore(measurement.getRedisTrendKey(), 0, now - 3600000);
            multi.exec((err_: any, replies: any) => {
              console.log(err_, replies); // 101, 51
            });
            this.redisPub.publish(measurement.getRedisStoreChannel(), JSON.stringify(msg));
            const redisTrendKey = measurement.getRedisTrendKey();
            this.redis.zrangebyscore(redisTrendKey, now - 3600000, now, (e: any, res_: any) => {
              const transformed = measurement.transformTrendData(res_);
              this.socketEmiter.emit(measurement.getSocketTrendChannel(), transformed);
            });
          } catch (e) {
            console.error(e, result);
          } finally {
            this.redis.zremrangebyscore(measurement.getRedisMinuteDataKey(), 0, Number.MAX_VALUE);
          }
        }
      });
    }

    const toMinute = Date.now() % 60000;
    setTimeout(() => this.agregator(), 60000 - toMinute);
  };
}

export default Agregator;
