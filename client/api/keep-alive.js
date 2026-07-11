/** Vercel cron pings Render so the free tier does not sleep. */
export default async function handler(_req, res) {
  const url =
    process.env.RENDER_HEALTH_URL ||
    "https://maktaba-jamaat-faisalabad-5.onrender.com/api/health";

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(55000) });
    return res.status(200).json({
      ok: response.ok,
      pinged: url,
      at: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(200).json({
      ok: false,
      error: err.message,
      at: new Date().toISOString(),
    });
  }
}
