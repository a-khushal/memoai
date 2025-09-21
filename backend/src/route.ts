import { Router } from "express";
import { randomUUID } from "crypto";
import { getChatResponse, getEmbedding } from "./services/gemini";
import { Message } from "./types";
import { addMessage, querySimilar } from "./services/chroma";
import { Twilio } from "twilio";
import { TWILIO_ACCOUNT_SID, TWILIO_WHATSAPP_NUMBER } from "./config";

const router = Router();
const client = new Twilio(TWILIO_WHATSAPP_NUMBER, TWILIO_ACCOUNT_SID);

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

router.post("/whatsapp", async (req, res) => {
    const from = req.body.from;
    const message = req.body.body;

    const embedding = await getEmbedding(message);
    await addMessage({ 
        id: crypto.randomUUID(), 
        user: from, 
        text: message, 
        embedding, 
        createdAt: new Date() 
    });

    const similar = await querySimilar(embedding);
    const context = similar.documents?.[0]?.join("\n") || "";

    const reply = await getChatResponse(context, message);

    const aiEmbedding = await getEmbedding(reply);
    await addMessage({ 
        id: crypto.randomUUID(), 
        user: "ai", 
        text: reply, 
        embedding: aiEmbedding, 
        response: true, 
        createdAt: new Date() 
    });

    await client.messages.create({
        from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
        to: from,
        body: reply,
    });

    res.sendStatus(200);
});

export default router;
