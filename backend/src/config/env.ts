import * as z from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().default(8000),

  MONGODB_URI: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  JWT_EXPIRE: z.string().default("7d"),

  FRONTEND_URL: z.string().url(),

  WHATSAPP_API_KEY: z.string().min(1),
  WHATSAPP_SENDER_ID: z.string().min(1),
  WHATSAPP_WELCOME_MESSAGE_ENG: z.string().min(1),
  WHATSAPP_WELCOME_MESSAGE_HINDI: z.string().min(1),
  WHATSAPP_DUE_MESSAGE_ENG: z.string().min(1),
  WHATSAPP_DUE_MESSAGE_HINDI: z.string().min(1),

  SMTP_PASS: z.string().min(1),
  SMTP_USER: z.string().email(),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(465),

  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number(),
  REDIS_USERNAME: z.string().min(1),
  REDIS_PASSWORD: z.string().min(1),
});

export const env = envSchema.parse(process.env);
