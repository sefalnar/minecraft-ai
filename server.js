import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 مفتاحك من Railway (Environment Variable)
const API_KEY = process.env.DEEPSEEK_API_KEY;

// 🧠 اختبار السيرفر
app.get("/", (req, res) => {
    res.send("Minecraft AI Server Online");
});

// 🤖 طلب AI
app.post("/ask", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "No message provided" });
    }

    try {
        const response = await axios.post(
            "https://api.deepseek.com/v1/chat/completions",
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "You are an assistant inside Minecraft."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 500
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.choices[0].message.content;

        res.json({ reply });

    } catch (err) {
        console.log("DeepSeek Error:", err.response?.data || err.message);

        res.status(500).json({
            error: "DeepSeek Error",
            details: err.response?.data || err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
