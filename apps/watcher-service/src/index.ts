import { prismaClient } from "@repo/db";
import { myQueue } from "@repo/queue";

async function watchService(){
    // do a db call check a process exists
    
    await myQueue.add('paint',{color : "red"});

}

watchService();