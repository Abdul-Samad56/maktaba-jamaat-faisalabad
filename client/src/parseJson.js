/** Parse fetch body; avoid "Unexpected token '<'" when HTML is returned instead of JSON. */
export async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    if (text.trimStart().startsWith("<!") || text.trimStart().startsWith("<html")) {
      throw new Error(
        "Server returned HTML instead of JSON. Open the Render API link once, wait 60 seconds, then retry."
      );
    }
    throw new Error("Invalid server response. Please try again.");
  }
}
