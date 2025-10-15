import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { prismaClient } from "@repo/db";
import { reconcileService } from "./reconcileService.js";
// @ts-ignore
const connection = new IORedis({maxRetriesPerRequest:null});

const worker = new Worker('docker-container-process',async (job : Job)=>{
    console.log(job.data);
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
    // mark processed in db.

},{connection});

