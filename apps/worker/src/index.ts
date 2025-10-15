import { prismaClient } from "@repo/db";
import { kafka } from "@repo/kafka-service";

const consumer = kafka.consumer({ groupId: "container-orchestration-group" });

async function worker() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "outbox-service-processed",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value?.toString(),
      });
      const value: any = message.value;
      const payLoad = JSON.parse(value);
      console.log("Topic Name : ", topic);
      console.log("Partition : ", partition);
      console.log(payLoad.serviceId);
      console.log(payLoad.status);
      // logs : {
      //   value: '{"serviceId":"b1f7de2d-a396-456e-87f4-648b738099c6","status":"DONE"}'
      // }
      // Topic Name :  outbox-service-processed
      // Partition :  0

      const updateServiceStatus = await prismaClient.outbox_Service.update({
        where: { id: payLoad.outbox_service_id },
        data: { status: payLoad.status },
      });
      console.log(updateServiceStatus);
    },
  });
}

worker();
