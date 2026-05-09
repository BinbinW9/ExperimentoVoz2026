export default async function handler(req, res) {
  const { OPENAI_API_KEY } = process.env;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "API Key no configurada" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Falta el texto" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "nova",
        input: text
      })
    });

    if (!response.ok) throw new Error("Error en TTS");
    const audioBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error generando audio" });
  }
}
