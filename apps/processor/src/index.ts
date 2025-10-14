import { Worker, Job } from "bullmq";
import IORedis from "ioredis";

// @ts-ignore
const connection = new IORedis({maxRetriesPerRequest:null});


const worker = new Worker('docker-container-process',async (job : Job)=>{
    console.log(job.data);
   
},{connection});

