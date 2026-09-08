export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Only GET requests are allowed"
    });
  }

  const { video_id } = req.query;

  if (!video_id) {
    return res.status(400).json({
      error: "video_id is required"
    });
  }

  try {
    const response = await fetch(
      `https://app-api.pixverse.ai/openapi/v2/video/result/${video_id}`,
      {
        method: "GET",
        headers: {
          "API-KEY": process.env.PIXVERSE_API_KEY,
          "Ai-trace-id": crypto.randomUUID()
        }
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        error: text || "Invalid response from PixVerse"
      };
    }

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
