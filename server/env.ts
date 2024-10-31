import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  FRONTEND_URL: z.string().url().optional().default("http://localhost:1234"),
  PORT: z.coerce.number().default(1234),
  DATABASE_URL: z.string().endsWith(".db"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});


export const env = envSchema.parse(process.env);

console.log("Environment configuration loaded:");
console.log("Node Environment:", env.NODE_ENV);
console.log("Frontend URL:", env.FRONTEND_URL);
console.log("Server Port:", env.PORT);
console.log("Database URL:", env.DATABASE_URL);
console.log("Log Level:", env.LOG_LEVEL);
