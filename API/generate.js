export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, duration, aspect_ratio } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(
      "https://app-api.pixverse.ai/openapi/v2/video/text/generate",
      {
        method: "POST",
        headers: {
          "API-KEY": process.env.PIXVERSE_API_KEY,
          "Ai-trace-id": crypto.randomUUID(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          aspect_ratio: aspect_ratio || "9:16",
          duration: Number(duration) || 5,
          model: "v6",
          quality: "720p",
          prompt: prompt
        })
      }
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Video generation request failed",
      message: error.message
    });
  }
}
