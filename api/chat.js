export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }
  
    const { prompt } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ error: "Falta el prompt" });
    }
  
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }]
        })
      });
  
      const data = await openaiRes.json();
      return res.status(200).json({ result: data.choices[0].message.content });
    } catch (error) {
      console.error("Error al llamar a OpenAI:", error);
      return res.status(500).json({ error: "Error del servidor" });
    }
  }
  