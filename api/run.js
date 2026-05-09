export default async function handler(req, res) {
  const { OPENAI_API_KEY } = process.env;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "API Key no configurada" });
  }

  const { action, threadId, content, assistantId, runId } = req.body;
  const headers = {
    "Authorization": `Bearer ${OPENAI_API_KEY}`,
    "OpenAI-Beta": "assistants=v2",
    "Content-Type": "application/json"
  };

  try {
    if (action === "createThread") {
      const response = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (action === "sendMessage") {
      await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify({ role: "user", content })
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "runAssistant") {
      const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: "POST",
        headers,
        body: JSON.stringify({ assistant_id: assistantId })
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (action === "checkRun") {
      const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        method: "GET",
        headers
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (action === "getMessages") {
      const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: "GET",
        headers
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: "Acción inválida" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
}
