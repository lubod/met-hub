/* eslint-disable max-classes-per-file */
import { createClient, RedisClientType } from "redis";
import { KafkaMessage } from "kafkajs";
import { IMeasurement } from "./measurement";
import SocketEmitter from "./socketEmitter";
import KafkaPC from "./kafkaPC";

class MinuteMap {
  minutes: Map<number, Array<any>>;
}

class AKafkaPC extends KafkaPC {
  keyMap: Map<string, MinuteMap>;

  measurements: IMeasurement[];

  redis: RedisClientType;

  socketEmitter: SocketEmitter;

  constructor(
    measurements: IMeasurement[],
    redis: RedisClientType,
    socketEmitter: SocketEmitter
  ) {
    super("agregator", "agregator-group");
    this.keyMap = new Map();
    this.measurements = measurements;
    this.redis = redis;
    this.socketEmitter = socketEmitter;
  }

  processMsg(message: KafkaMessage) {
    const data = JSON.parse(message.value.toString());
    data.timestamp = new Date(data.timestamp);
    // console.info("------ DATA ", data);

    let minuteMap: MinuteMap = this.keyMap.get(message.key.toString());
    if (minuteMap == null) {
      minuteMap = new MinuteMap();
      minuteMap.minutes = new Map();
      this.keyMap.set(message.key.toString(), minuteMap);
    }

    const minute = Math.floor(data.timestamp.getTime() / 60000) * 60000;
    let minuteBuffer = minuteMap.minutes.get(minute);
    if (minuteBuffer == null) {
      minuteBuffer = [];
      minuteMap.minutes.set(minute, minuteBuffer);
    }
    // console.info("---- ADD TO MIN ----", minute, message.key.toString());
    minuteBuffer.push(data);
    // console.info(this.keyMap);
  }

  startAgregator = async () => {
    console.info("kafka agregator");
    const cminute = Math.floor(Date.now() / 60000) * 60000;
    for (const measurement of this.measurements) {
      const kafkaKey = measurement.getKafkaKey();
      console.log(kafkaKey);
      const minuteMap = this.keyMap.get(kafkaKey);
      if (minuteMap != null && minuteMap.minutes != null) {
        for (const [minute, data] of minuteMap.minutes.entries()) {
          if (minute < cminute) {
            try {
              console.info(minute, data);
              const avg = measurement.agregateMinuteDataFromKafka(minute, data);
              this.kafkaProducer.send({
                topic: measurement.getKafkaStoreTopic(),
                messages: [
                  {
                    key: measurement.getKafkaKey(),
                    value: JSON.stringify(avg),
                  },
                ],
              });

              const multi = this.redis.multi();
              const now = Date.now();

              multi.zAdd(measurement.getRedisTrendKey(), {
                score: minute,
                value: JSON.stringify(avg),
              });
              multi.zRemRangeByScore(
                measurement.getRedisTrendKey(),
                0,
                now - 3600000
              );
              multi.exec();
              const redisTrendKey = measurement.getRedisTrendKey();
              // eslint-disable-next-line no-await-in-loop
              const res = await this.redis.zRangeByScore(
                redisTrendKey,
                now - 3600000,
                now
              );
              const transformed = measurement.transformTrendData(res);
              this.socketEmitter.emit(
                measurement.getSocketTrendChannel(),
                transformed
              );
              minuteMap.minutes.delete(minute);
            } catch (e) {
              console.error(e);
            } finally {
              this.redis.zRemRangeByScore(
                measurement.getRedisMinuteDataKey(),
                0,
                Number.MAX_VALUE
              );
            }
          }
        }
      }
    }
    const toMinute = Date.now() % 60000;
    setTimeout(() => this.startAgregator(), 60000 - toMinute + 5000);
  };
}

class Agregator {
  redis: RedisClientType;

  measurements: IMeasurement[];

  socketEmitter: SocketEmitter;

  kc: AKafkaPC;

  constructor(socketEmiter: SocketEmitter, measurements: IMeasurement[]) {
    this.redis = createClient();
    this.measurements = measurements;
    this.socketEmitter = socketEmiter;
    this.kc = new AKafkaPC(measurements, this.redis, this.socketEmitter);
  }

  start = async () => {
    console.info("start agregator");
    await this.redis.connect();
    const toMinute = Date.now() % 60000;
    await this.kc.startConsumer("data");
    await this.kc.startProducer();
    setTimeout(() => this.kc.startAgregator(), 60000 - toMinute + 5000);
  };
}

export default Agregator;
