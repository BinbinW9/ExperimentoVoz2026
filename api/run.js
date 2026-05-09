export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "❌ OPENAI_API_KEY is NOT set in environment variables" });
  }

  try {
    const { action, threadId, content, assistantId, runId } = req.body;
    let url, method, body;

    switch (action) {
      case "createThread":
        url = "https://api.openai.com/v1/threads";
        method = "POST";
        break;
      case "runAssistant":
        url = `https://api.openai.com/v1/threads/${threadId}/runs`;
        method = "POST";
        body = { assistant_id: assistantId };
        break;
      case "checkRun":
        url = `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`;
        method = "GET";
        break;
      case "getMessages":
        url = `https://api.openai.com/v1/threads/${threadId}/messages`;
        method = "GET";
        break;
      default:
        return res.status(400).json({ error: "❌ Invalid action: " + action });
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${key}`,
        "OpenAI-Beta": "assistants=v1",
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: `❌ OpenAI API Error: ${response.status}`,
        details: data
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("❌ Handler error:", err);
    return res.status(500).json({
      error: "❌ Internal Server Error",
      message: err.message
    });
  }
}
