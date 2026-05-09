export default async function handler(req, res) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).send("API key missing");

  try {
    const { text } = req.body;
    if (!text) return res.status(400).send("Missing text");

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: "tts-1", voice: "nova", input: text })
    });

    if (!response.ok) return res.status(500).send("TTS error");
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(buffer);

  } catch (err) {
    res.status(500).send("Error");
  }
}
