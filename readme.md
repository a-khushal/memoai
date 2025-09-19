# AI Assistant with Vector Memory

A minimal **Slack/WhatsApp AI bot** with **conversational memory**:
- Uses **Gemini** for embeddings + chat  
- Stores messages in **ChromaDB** for vector search  
- Exposes a `/ask` API for conversation  
- Includes a **React dashboard** for logs & stats (coming soon)  

---

## Features Done
- Express backend setup  
- Health check route (`/health`)  
- `/ask` endpoint:  
  - Embeds user message  
  - Stores in ChromaDB  
  - Retrieves similar past messages for context  
  - Calls Gemini for AI reply  
  - Stores AI reply in ChromaDB  
  - Returns reply as JSON  

---

## Next Steps
- `/history` endpoint for conversation logs  
- Slack bot integration  
- WhatsApp integration (via Twilio)  
- React dashboard (chat logs + stats)  
- Deployment (Railway/Render + Vercel)  

---

## Tech Stack
- **Backend:** Node.js, Express, TypeScript  
- **AI:** Google Gemini (chat + embeddings)  
- **Vector DB:** ChromaDB  
- **Frontend:** React + Tailwind

---

## Getting Started
```bash
# clone repo
git clone <repo_url>
cd project

# install dependencies
npm install

# start backend
npm run dev
```

---

## Environment Variables (.env)
```bash
GOOGLE_API_KEY=your_gemini_api_key
CHROMA_URL=http://localhost:8000
PORT=3000
```

---

## System Architecture
```bash
flowchart TD
    U[User Message] -->|/ask| B[Express Backend]

    B -->|Embed message| G1[Gemini Embeddings]
    G1 -->|Vector| C[ChromaDB]

    B -->|Query similar| C
    C -->|Context| B

    B -->|Chat completion| G2[Gemini Chat]
    G2 -->|AI reply| B

    B -->|Store reply| C
    B -->|Return JSON {reply}| U

    C -->|Logs & Stats| D[React Dashboard]
```

---

