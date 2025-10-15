import { docker } from "./dockerRodeService.js";
export async function ensureImageService(image : string){
    const images = await docker.listImages();
    const exists = images.some(i => i.RepoTags?.includes(image));
    if(exists) return;
    
    console.log(`Image ${image} not found locally. Pulling...`);
    await new Promise((resolve,reject)=>{
        docker.pull(image,(err:any,stream:any)=>{
            docker.modem.followProgress(stream,resolve,event=>{
                if(event.status) console.log(event.status);
            })
        })
    });
    console.log(`Image ${image} pulled successfully.`);
}