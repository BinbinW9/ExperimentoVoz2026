import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { action, threadId, content, runId, assistantId } = req.body;

  try {
    if (action === 'createThread') {
      const thread = await openai.beta.threads.create();
      return res.status(200).json(thread);
    }

    if (action === 'sendMessage') {
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: content,
      });
      return res.status(200).json({ ok: true });
    }

    if (action === 'runAssistant') {
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });
      return res.status(200).json(run);
    }

    if (action === 'checkRun') {
      const run = await openai.beta.threads.runs.retrieve(threadId, runId);
      return res.status(200).json(run);
    }

    if (action === 'getMessages') {
      const messages = await openai.beta.threads.messages.list(threadId);
      return res.status(200).json(messages);
    }

    return res.status(400).json({ error: 'Acción inválida' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
