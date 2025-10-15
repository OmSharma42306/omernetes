import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { prismaClient } from "@repo/db";
import { reconcileService } from "./reconcileService.js";
import { kafka } from "@repo/kafka-service";
// @ts-ignore
const connection = new IORedis({maxRetriesPerRequest:null});

// creating kafka producer...
const producer = kafka.producer();

async function initProcessor(){
    try{
        // connect kafka producer
        await producer.connect();
        console.log("Kafka Producer connected...!");

        // bullmq worker...
        const worker = new Worker('docker-container-process',async (job : Job)=>{
    console.log(job.data);
    try{
        const serviceId = job.data.serviceId;
    console.log(serviceId);
    console.log("fetching outbox service ....");
    const outboxService = await prismaClient.outbox_Service.findFirst({
        where : {
            serviceId : serviceId, status : "PROCESSING"
        },
        include : {
            service : true
        }
    });

    console.log(outboxService);
    if(!outboxService) {
        console.log("No outbox Service Found!!");
        return;
    }

    const svc  = outboxService.service;
    // const svc = outboxService.service as serviceType;
    
    console.log(`Reconciling Service: ${svc.name} ...`);
    

    // handle containers scale up and down based on this svc info.
    await reconcileService(svc);
    
    // put an acknowledgment to kafka that all required containerers scaled up or scaled down.
    
    await producer.send({
        topic : "outbox-service-processed",
        messages : [{value: JSON.stringify({serviceId,status:"DONE",outbox_service_id : outboxService.id})}],
    });

     console.log(`Job ${job.id} completed ✅`);
    }catch(error){
        console.error("Error processing job:", error);
          throw error; // rethrow for BullMQ retries
    }
    
    

},{connection});

//  handling worker errors...
worker.on("failed",(job:any,err)=>{
     console.error(`Job ${job.id} failed:`, err);
});

worker.on("completed",(job)=>{
    console.log(`Job ${job.id} successfully completed`);
});

  // Graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down worker and Kafka producer...");
      await worker.close();
      await producer.disconnect();
      await connection.quit();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    }catch(error){
         console.error("Failed to start processor:", error);
    process.exit(1);
    }
}


// Start the processor
initProcessor();
