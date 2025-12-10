import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, DB_URI, NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN, ARCJET_KEY, ARCJET_ENV, QSTASH_URL, QSTASH_TOKEN, SERVER_URL, EMAIL_PASSWORD } = process.env;

// Added basic validation for critical env vars
if (!DB_URI) throw new Error('DB_URI is required');
if (!JWT_SECRET) throw new Error('JWT_SECRET is required');
if (!EMAIL_PASSWORD) throw new Error('EMAIL_PASSWORD is required');