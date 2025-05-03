const fetch = require("node-fetch");

module.exports = async (req, res) => {
  console.log("📡 Iniciando conexión a GPT-3.5...");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: req.body.message || "Hola GPT" }],
      }),
    });

    const text = await response.text(); // 👈 primero leemos como texto

    try {
      const data = JSON.parse(text); // 👈 luego intentamos parsear
      if (!response.ok) {
        console.error("❌ Error OpenAI:", data);
        return res.status(response.status).json({ error: data });
      }

      const reply = data.choices?.[0]?.message?.content;
      console.log("✅ Respuesta GPT:", reply);

      return res.status(200).json({ text: reply });
    } catch (jsonErr) {
      console.error("❌ No se pudo parsear JSON:", text);
      return res.status(500).json({ error: "Respuesta no válida de OpenAI" });
    }
  } catch (error) {
    console.error("❌ Error al conectar con GPT-3.5:", error);
    return res.status(500).json({ error: "Error al conectar con GPT-3.5" });
  }
};
