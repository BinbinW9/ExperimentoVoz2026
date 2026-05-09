export default async function handler(req, res) {
  res.setHeader('Content-Type', 'audio/mpeg');

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return res.status(500).send("API key missing");
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).send("Missing text");
    }

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "nova",
        input: text
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI TTS Error:", response.status, errText);
      return res.status(500).send(`OpenAI Error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    res.status(200).send(Buffer.from(audioBuffer));

  } catch (err) {
    console.error("Speak function error:", err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
}
