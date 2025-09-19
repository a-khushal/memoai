import { Router } from "express";
import { randomUUID } from "crypto";
import { getChatResponse, getEmbedding } from "./services/gemini";
import { Message } from "./types";
import { addMessage, querySimilar } from "./services/chroma";

const router = Router();

router.get("/health", (_, res) => res.json({ status: "ok" }));

router.post("/ask", async (req, res) => {
    try {
        const { user, message } = req.body;

        const embedding = await getEmbedding(message);

        const userMsg: Message = {
            id: randomUUID(),
            user,
            text: message,
            embedding,
            createdAt: new Date(),
        };

        await addMessage(userMsg);

        const similar = await querySimilar(embedding);
        const contextDocs = similar.documents?.[0] || [];
        const context = contextDocs.join("\n");

        const aiReply = await getChatResponse(context, message);

        const aiMsg: Message = {
            id: randomUUID(),
            user: "ai",
            text: aiReply,
            embedding: await getEmbedding(aiReply),
            response: true,
            createdAt: new Date(),
        };

        await addMessage(aiMsg);

        res.json({ reply: aiReply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;
