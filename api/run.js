export default async function handler(req, res) {
    const key = process.env.OPENAI_API_KEY;
    const { action, threadId, content, assistantId, runId } = req.body;

    let url, method, body;

    switch (action) {
        case "createThread":
            url = "https://api.openai.com/v1/threads";
            method = "POST";
            break;
        case "sendMessage":
            url = `https://api.openai.com/v1/threads/${threadId}/messages`;
            method = "POST";
            body = { role: "user", content };
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
            return res.status(400).end();
    }

    const response = await fetch(url, {
        method,
        headers: {
            "Authorization": `Bearer ${key}`,
            "OpenAI-Beta": "assistants=v2",
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    return res.json(data);
}