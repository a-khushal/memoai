import { ChromaClient, Collection } from "chromadb";
import { CHROMA_URL } from "../config";
import { Message } from "../types";

const client = new ChromaClient({ path: CHROMA_URL });
let collection: Collection;

export async function initChroma() {
    collection = await client.getOrCreateCollection({ name: "chat_history" });
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
