import {
  Consumer,
  ConsumerSubscribeTopics,
  EachMessagePayload,
  Kafka,
  KafkaMessage,
  Producer,
} from "kafkajs";

export default abstract class KafkaPC {
  kafkaConsumer: Consumer;

  kafkaProducer: Producer;

  kafka: Kafka;

  clientId: string;

  grouopId: string;

  constructor(clientId: string, grouopId: string) {
    this.clientId = clientId;
    this.grouopId = grouopId;
    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: ["localhost:9092"],
    });
  }

  async startProducer() {
    this.kafkaProducer = this.kafka.producer();
    await this.kafkaProducer.connect();
  }

  // eslint-disable-next-line no-unused-vars
  abstract processMsg(message: KafkaMessage): any;

  async startConsumer(ctopic: string): Promise<void> {
    this.kafkaConsumer = this.kafka.consumer({ groupId: this.grouopId });
    const subTopics: ConsumerSubscribeTopics = {
      topics: [ctopic],
      fromBeginning: false,
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(subTopics);

      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { topic, partition, message } = messagePayload;
          const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
          console.info(`- ${prefix} ${message.key}#${message.value}`);
          this.processMsg(message);
        },
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  }
}
