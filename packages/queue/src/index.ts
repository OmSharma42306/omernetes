import { Queue } from "bullmq";

export const myQueue = new Queue('docker-container-process');
