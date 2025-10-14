import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer"
import yaml from "js-yaml";
import { prismaClient } from "@repo/db";
import { deploymentSchema } from "@repo/common"

const PORT = 5000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const upload = multer();

app.post('/config',upload.single('file'),async(req:Request,res:Response)=>{
    try{
        const file = req.file;
        const data : any = req.file?.buffer.toString();
        const userID = "1fbf31ca-4fa9-45d5-a71a-0efa3542d116";
        
        console.log("Data: ",data);

        const yamlData = yaml.load(data);

        const parsedResult = deploymentSchema.safeParse(yamlData);

        if(!parsedResult.success){
            res.status(400).json({msg : "Invalid Schema of yaml file."});
            return;
        };
        const versionName = parsedResult.data.version;
        const checkConfigExists = await prismaClient.config.findFirst({
            where : {version : versionName,userId : userID}
        });
        
        if(!checkConfigExists){
            const createConfig = await prismaClient.config.create({
                data : {
                    version : versionName,
                    userId : userID
                }
            });        
        }
        
        // const configs = await prismaClient.config.findMany({
        //     where : {
        //         version : versionName
        //     },
        //     select:{
        //         id : true
        //     }
        // });

        const configs = await prismaClient.config.findFirst({
            where : {
                version : versionName,
                userId : userID
            }
        });

        const configId : any  = configs?.id ;

        console.log("Version Name : ",versionName);
        await prismaClient.$transaction(async (tx)=>{
            for(const [name,svc] of Object.entries(parsedResult.data.services)){

               const initService = await tx.services.upsert({
                where :{
                    name_configId : {
                        name : name,
                        configId : configId
                    },
                },
                
                update : {
                    name : name,
                    image : svc.image,
                    desired_state : Number(svc.replicas),
                    current_state : 0,
                    env : svc.env || {},
                    ports : svc.ports || [],
                    volumes : svc.volumes || [],
                    userId : userID

                },
                create : {
                    name : name,
                    image : svc.image,
                    desired_state : Number(svc.replicas),
                    current_state : 0,
                    env : svc.env || {},
                    ports : svc.ports || [],
                    volumes : svc.volumes || [],
                    configId : configId,
                    userId : userID
                }
            });

            const outboxService = await tx.outbox_Service.create({
                data : {
                    serviceId : initService.id,

                }
            });

            console.log("********************************************************")
            console.log(name);
            console.log(svc.image);
            console.log(svc.replicas);
            console.log(svc.ports);
            console.log(svc.env);
            console.log("********************************************************")
        }

        })
        
        res.status(200).json({msg : "Your Config Validated Successfully!.",version : versionName, services: Object.keys(parsedResult.data.services)});
        return;
    }catch(error){
        res.status(400).json({msg : error});
        return;
    }
});

app.listen(PORT,()=>{console.log(` Api Server Started! : ${PORT}`)});

