import { Kafka } from "kafkajs";


export const kafka = new Kafka({
    clientId : "my-omernetes",
    // brokers : ['kafka1:9092','kafka2:9092']
    brokers : ['localhost:9092']
});

