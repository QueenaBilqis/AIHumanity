// server.js (versi GRATIS dengan Hugging Face)
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Ganti dengan token Hugging Face-mu
const HF_TOKEN = "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";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Endpoint chatbot
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage || typeof userMessage !== "string") {
    return res.status(400).json({ reply: "Pesan tidak valid." });
  }

  try {
    // Gunakan model open-source (Bahasa Inggris, tapi cukup responsif)
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      { inputs: userMessage },
      {
        headers: { Authorization: `Bearer ${HF_TOKEN}` },
      }
    );

    let reply =
      response.data?.generated_text || response.data[0]?.generated_text;
    if (!reply) reply = "Maaf, saya sedang lambat merespons. Coba lagi ya!";

    // Opsional: terjemahkan ke Bahasa Indonesia dengan aturan sederhana (jika perlu)
    res.json({ reply });
  } catch (error) {
    console.error("Hugging Face Error:", error.response?.data || error.message);
    res.status(500).json({
      reply: "Maaf, saya sedang mengalami gangguan teknis. Coba lagi nanti!",
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
