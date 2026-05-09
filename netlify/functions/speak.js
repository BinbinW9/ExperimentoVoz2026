export default async function handler(req, res) {
    const key = process.env.OPENAI_API_KEY;
    const { text } = req.body;

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

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    return res.send(Buffer.from(buffer));
}
