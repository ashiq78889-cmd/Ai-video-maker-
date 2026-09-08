export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed"
    });
  }

  try {
    const { prompt, duration, aspect_ratio } = req.body || {};

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required"
      });
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
          model: "v6",
          prompt: prompt,
          duration: Number(duration) || 5,
          aspect_ratio: aspect_ratio || "9:16",
          quality: "720p"
        })
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        error: text || "PixVerse returned an invalid response"
      };
    }

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
