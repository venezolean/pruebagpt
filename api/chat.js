import fetch from "node-fetch";

// /api/chat.js
module.exports = async (req, res) => {
  try {
    // Leer y parsear el cuerpo manualmente
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const bodyString = Buffer.concat(buffers).toString();
    const body = JSON.parse(bodyString); // <-- AQUÍ OCURRÍA EL ERROR

    const userMessage = body.message || "Hola GPT";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error:", data);
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json({ text: data.choices?.[0]?.message?.content });
  } catch (error) {
    console.error("❌ Error al conectar con GPT-3.5:", error);
    res.status(500).json({ error: "Error al conectar con GPT-3.5" });
  }
};
