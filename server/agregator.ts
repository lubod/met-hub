import redis from 'redis';
import { Station } from './station';
import { Dom } from './dom';
import { IMeasurement } from './measurement';
import { SocketEmitter } from './socketEmitter';

export class Agregator {
    redisClient: redis.RedisClient;
    redisPub: redis.RedisClient;
    measurements: IMeasurement[];
    socketEmiter: SocketEmitter;

    constructor(socketEmiter: SocketEmitter) {
        this.redisClient = redis.createClient();
        this.redisPub = redis.createClient();
        this.measurements = [new Station(), new Dom()];
        this.socketEmiter = socketEmiter;
    }

    start = () => {
        console.info('start agregator');
        const toMinute = Date.now() % 60000;
        setTimeout(() => this.agregator(), 60000 - toMinute);
    }

    agregator = () => {
        for (const measurement of this.measurements) {
            console.log(measurement.getRedisMinuteDataKey());
            this.redisClient.zrangebyscore(measurement.getRedisMinuteDataKey(), 0, Number.MAX_VALUE, (err: any, result: any) => {
                if (result.length > 0) {
                    //console.info(result);
                    try {
                        const map = measurement.agregateMinuteData(result);
                        const multi = this.redisClient.multi();
                        const msg: any[] = [];
                        const now = Date.now();

                        map.forEach((avg: any, minute: string | number) => {
                            multi.zadd(measurement.getRedisTrendKey(), minute, JSON.stringify(avg));
                            msg.push(avg);
                        });
                        multi.zremrangebyscore(measurement.getRedisTrendKey(), 0, now - 3600000);
                        multi.exec((err: any, replies: any) => {
                            console.log(replies); // 101, 51
                        });
                        this.redisPub.publish(measurement.getRedisStoreChannel(), JSON.stringify(msg));
                        this.redisClient.zrangebyscore(measurement.getRedisTrendKey(), now - 3600000, now, (err: any, result: any) => {
                            this.socketEmiter.emit(measurement.getSocketTrendChannel(), measurement.transformTrendData(result));
                        });
                    } catch (e) {
                        console.error(e, result);
                    }
                    finally {
                        this.redisClient.zremrangebyscore(measurement.getRedisMinuteDataKey(), 0, Number.MAX_VALUE);
                    }
                }
            });
        }

        const toMinute = Date.now() % 60000;
        setTimeout(() => this.agregator(), 60000 - toMinute);
    }
}