import { ChromaClient, Collection } from "chromadb";
import { CHROMA_HOST, CHROMA_PORT, CHROMA_COLLECTION, CHROMA_RESET } from "../config";
import { Message } from "../types";

const client = new ChromaClient({
    host: CHROMA_HOST,
    port: parseInt(CHROMA_PORT)
});

let collection: Collection;

export async function initChroma() {
    if (CHROMA_RESET) {
        try {
            const existing = await client.getCollection({ name: CHROMA_COLLECTION });
            if (existing) {
                await client.deleteCollection({ name: CHROMA_COLLECTION });
            }
        } catch { }
    }
    collection = await client.getOrCreateCollection({
        name: CHROMA_COLLECTION,
        metadata: { embedding_dimension: 384 },
    });
}

export async function addMessage(msg: Message) {
    if (!msg.embedding) return;
    await collection.add({
        ids: [msg.id],
        embeddings: [msg.embedding],
        metadatas: [{ user: msg.user, response: msg.response || false }],
        documents: [msg.text],
    });
}

export async function querySimilar(textEmbedding: number[], k = 3) {
    return await collection.query({
        queryEmbeddings: [textEmbedding],
        nResults: k,
    });
}
