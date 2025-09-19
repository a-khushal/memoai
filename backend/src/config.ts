import dotenv from "dotenv";
dotenv.config();

export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
export const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
export const PORT = process.env.PORT || 3000;
