import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from 'url';
import yaml from "js-yaml"
import { deploymentSchema } from "@repo/common"

// Get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readYaml(){
    const filePath = path.join(__dirname,'./../data/deployment.yml');
    console.log(filePath);

    try{    
        const data = await fs.readFile(filePath,'utf-8');
        console.log(data);
        const c = yaml.load(data);
        const parsed = deploymentSchema.safeParse(c);
        console.log("YAML is valid!", parsed);
    }catch(error){
        console.error(error);
    }
};

readYaml();