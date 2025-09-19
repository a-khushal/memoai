import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from "../config";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

function normalizeEmbeddingDimension(embedding: number[], targetDim = 384): number[] {
    if (embedding.length === targetDim) return embedding;
    if (embedding.length > targetDim) return embedding.slice(0, targetDim);
    const padded = new Array(targetDim).fill(0);
    for (let i = 0; i < embedding.length; i++) padded[i] = embedding[i];
    return padded;
}

export async function getGeminiEmbedding(text: string): Promise<number[]> {
    const res = await embeddingModel.embedContent(text);
    return normalizeEmbeddingDimension(res.embedding.values, 384);
}

export async function getOllamaEmbedding(text: string): Promise<number[]> {
    // ollama nomic-embed-text embedding.
    const response = await fetch("http://localhost:11434/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "nomic-embed-text",
            prompt: text
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama embedding failed: ${response.statusText}`);
    }

    const data = await response.json();
    return normalizeEmbeddingDimension(data.embedding, 384);
}

export async function getEmbeddingFromService(text: string): Promise<number[]> {
    try {
        return await getGeminiEmbedding(text);
    } catch (error: any) {
        console.log("Falling back to Ollama embeddings...");
        return await getOllamaEmbedding(text);
    }
}
