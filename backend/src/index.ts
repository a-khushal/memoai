import express from "express";
import bodyParser from "body-parser";
import router from "./route";
import { PORT } from "./config";
import { initChroma } from "./services/chroma";

async function main() {
    await initChroma();

    const app = express();
    app.use(bodyParser.json());
    app.use(router);

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

main();
