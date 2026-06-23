import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GROQ_API_KEY;

app.get("/", (req, res) => {
    res.send("AI Server Running");
});

app.post("/ask", async (req, res) => {
    try {
        const message = req.body.message;

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "user", content: message }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            reply: response.data.choices[0].message.content
        });

    } catch (err) {
        console.log(err.response?.data || err.message);

        res.status(500).json({
            error: "Groq Error",
            details: err.response?.data || err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on", PORT);
});
