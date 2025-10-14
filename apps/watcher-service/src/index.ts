import { prismaClient } from "@repo/db";
import { myQueue } from "@repo/queue";

const BATCH_SIZE = 10;

async function watchService(){

    try{
        // atomically pick some pending rows.
        const pendingRows = await prismaClient.$transaction(async tx=>{
            const rows = await tx.outbox_Service.findMany({
                where : {status : "PENDING"},
                orderBy : { 'createdAt' : "asc"},
                take : BATCH_SIZE
            });

            if (rows.length === 0) return [];

            const ids = rows.map((r)=> r.id);

            await tx.outbox_Service.updateMany({
                where : {id : {in : ids}},
                data : { status : "PROCESSING", processedAt : new Date()},
            });
            console.log("done transaction")
            return rows;
        });

        //  Pushing picked Entries from db to queue
        console.log("putting stuff into queue...")
        for (const row of pendingRows){
            await myQueue.add('service-process',{serviceId : row.serviceId});
        }
        console.log("done putting stuff into queue...")
    }catch(error){
        console.error(error);
    }    
}

setInterval(() => {
    watchService();
}, 5000);