import dotenv from "dotenv";
dotenv.config();

export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
export const CHROMA_HOST = process.env.CHROMA_HOST || "localhost";
export const CHROMA_PORT = process.env.CHROMA_PORT || "8000";
export const PORT = process.env.PORT || 3000;
export const CHROMA_COLLECTION = process.env.CHROMA_COLLECTION || "chat_history";
export const CHROMA_RESET = (process.env.CHROMA_RESET || "false").toLowerCase() === "true";
export const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || '';
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';