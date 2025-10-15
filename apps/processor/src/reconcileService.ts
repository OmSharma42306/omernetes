import { docker } from "./dockerRodeService.js";
import {ensureImageService} from "./ensureImageService.js";

export async function reconcileService(svc : any){
    console.log('i am here',svc);
    docker.ping((err, res) => console.log(err, res)); 
    await ensureImageService(svc.image);
    const containers = await docker.listContainers({ all : true });
    


    
    const running = containers.filter(c => c.Labels["service_id"] === svc.id);

    console.log("Containers : ",containers);
    console.log("Running Containers : ",running);

    // scale down if too many replicas.
    if(running.length > svc.desired_state){
        const toRemove = running.slice(svc.desired_state);
        for (const c of toRemove){
            const container = docker.getContainer(c.Id);
            console.log(`Stopping and removing container ${c.Id}`);
            await container.stop();
            await container.remove();
        }
    }   
    
    // scale up if there are less containers or replicas.
    if(running.length < svc.desired_state){
        const missing = svc.desired_state - running.length;
        for(let i = 0 ; i < missing; i++){
            console.log(`Creating new container for service ${svc.name}`);
            try{
                const container = await docker.createContainer({
                Image : svc.image,
                Labels : {service_id : svc.id},
                Env: Object.entries(svc.env || {}).map(([k, v]) => `${k}=${v}`),
                HostConfig: {
                    Binds: svc.volumes || [],
                    PortBindings: (svc.ports || []).reduce((acc: any, p: string) => {
                        const [hostPort, containerPort] = p.split(":");
                        acc[`${containerPort}/tcp`] = [{ HostPort: hostPort }];
                        return acc;
                    }, {})
                },
                name : `${svc.name}-${Date.now()}`
            });

            await container.start();
              console.log(`✅ Started container for service ${svc.name}`);
            }catch(error){
                 console.error(` Failed to create/start container for ${svc.name}:`, error);
            }   
            
        }
    }   
}