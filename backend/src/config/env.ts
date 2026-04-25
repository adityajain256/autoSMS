    import * as z from "zod";

    export const envSchema = z.object({
        NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
        PORT: z.string().default("8000"),

        MONGODB_URI: z.string().nonempty("MONGODB_URI is required"),

        JWT_SECRET: z.string().nonempty("JWT_SECRET is required"),
        JWT_EXPIRE: z.string().default("7d"),

        TWILIO_ACCOUNT_SID: z.string().nonempty("TWILIO_ACCOUNT_SID is required"),
        TWILIO_AUTH_TOKEN: z.string().nonempty("TWILIO_AUTH_TOKEN is required"),
        TWILIO_PHONE: z.string().nonempty("TWILIO_PHONE is required"),

        FRONTEND_URL: z.string().default("http://localhost:5173"),

        FAST2SMS_API_KEY: z.string().nonempty("FAST2SMS_API_KEY is required"),
        FAST2SMS_SENDER_ID: z.string().nonempty("FAST2SMS_SENDER_ID is required"),
        FAST2SMS_WELCOME_MESSAGE_ENG: z.string().nonempty("FAST2SMS_WELCOME_MESSAGE_ENG is required"),
        FAST2SMS_WELCOME_MESSAGE_HINDI: z.string().nonempty("FAST2SMS_WELCOME_MESSAGE_HINDI is required"),
        FAST2SMS_DUE_MESSAGE_ENG: z.string().nonempty("FAST2SMS_DUE_MESSAGE_ENG is required"),
        FAST2SMS_DUE_MESSAGE_HINDI: z.string().nonempty("FAST2SMS_DUE_MESSAGE_HINDI is required"),
        
        WHATSAPP_API_KEY: z.string().nonempty("WHATSAPP_API_KEY is required"),
        WHATSAPP_SENDER_ID: z.string().nonempty("WHATSAPP_SENDER_ID is required"),
        WHATSAPP_WELCOME_MESSAGE_ENG: z.string().nonempty("WHATSAPP_WELCOME_MESSAGE_ENG is required"),
        WHATSAPP_WELCOME_MESSAGE_HINDI: z.string().nonempty("WHATSAPP_WELCOME_MESSAGE_HINDI is required"),
        WHATSAPP_DUE_MESSAGE_ENG: z.string().nonempty("WHATSAPP_DUE_MESSAGE_ENG is required"),
        WHATSAPP_DUE_MESSAGE_HINDI: z.string().nonempty("WHATSAPP_DUE_MESSAGE_HINDI is required"),
    });