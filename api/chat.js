const fetch = require("node-fetch");

module.exports = async (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const parsed = JSON.parse(body);
      const message = parsed.message;

      if (!message) {
        return res.status(400).json({ error: "Falta el campo 'message' en la solicitud" });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Error en respuesta OpenAI:", data);
        return res.status(response.status).json({ error: data });
      }

      console.log("✅ Respuesta GPT:", data.choices?.[0]?.message?.content);

      res.status(200).json({ text: data.choices?.[0]?.message?.content });
    } catch (error) {
      console.error("❌ Error general:", error);
      res.status(500).json({ error: "Error al conectar con GPT-3.5" });
    }
  });
};
