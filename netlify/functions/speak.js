export default async function handler(req, res) {
  res.setHeader('Content-Type', 'audio/mpeg');

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "OPENAI_API_KEY not set" });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Missing text" });
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
      const errData = await response.json();
      return res.status(500).json({ error: errData });
    }

    const audioBuffer = await response.arrayBuffer();
    res.status(200).send(Buffer.from(audioBuffer));

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
