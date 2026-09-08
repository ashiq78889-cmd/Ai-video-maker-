export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://app-api.pixverse.ai/openapi/v2/account/credit",
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
      data = { error: text };
    }

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
