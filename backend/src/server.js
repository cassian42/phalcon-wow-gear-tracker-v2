import 'dotenv/config';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/", (_, res) => res.json({ status: "ok", message: "Phalcon Gear Tracker v2 API" }));
app.use("/api", routes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
