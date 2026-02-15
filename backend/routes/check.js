const express = require("express");
const { performance } = require("node:perf_hooks");

const router = express.Router();

/**
 * Normalizes user input into a valid URL.
 * If protocol is missing, https:// is prepended.
 */
function normalizeUrl(input) {
  const trimmed = String(input || "").trim();
  if (!trimmed) {
    throw new Error("URL is required.");
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const parsed = new URL(withProtocol);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  return parsed.toString();
}

/**
 * Runs a timed fetch request and reports HTTP status and resolved URL.
 */
router.post("/", async (req, res) => {
  try {
    const timeoutFromEnv = Number(process.env.DEFAULT_TIMEOUT_MS) || 4000;
    const timeoutMs = Number(req.body?.timeoutMs) || timeoutFromEnv;
    const targetUrl = normalizeUrl(req.body?.url);

    if (timeoutMs < 500 || timeoutMs > 20000) {
      return res.status(400).json({
        ok: false,
        error: "timeoutMs must be between 500 and 20000."
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const start = performance.now();

    let response;
    try {
      response = await fetch(targetUrl, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const elapsed = Math.round(performance.now() - start);

    return res.status(200).json({
      ok: true,
      url: targetUrl,
      finalUrl: response.url,
      status: response.status,
      responseTimeMs: elapsed,
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return res.status(504).json({
        ok: false,
        error: "Request timeout."
      });
    }

    const isValidationError = /required|supported|Invalid URL/i.test(error.message);
    return res.status(isValidationError ? 400 : 502).json({
      ok: false,
      error: isValidationError ? error.message : "Failed to check URL."
    });
  }
});

module.exports = router;
