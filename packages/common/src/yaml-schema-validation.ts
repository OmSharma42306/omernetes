import { z } from "zod";

// Schema for a single service
const serviceSchema = z.object({
  image: z.string(),
  ports: z.array(z.string().regex(/^\d+:\d+$/)).optional(),
  replicas: z.number().int().min(1).optional(),
  env: z.record(z.string(), z.string()).optional(),  // ✅ key: string, value: string
  volumes: z.array(z.string()).optional(),
});

// Schema for all services
export const servicesSchema = z.record(z.string(), serviceSchema); // ✅ key: service name, value: service schema

// Top-level schema
export const deploymentSchema = z.object({
  version: z.enum(["v1"]),
  services: servicesSchema,
});

