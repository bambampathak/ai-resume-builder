import OpenAI from "openai";
import config from "../config/env.js";
import { generateDemoResponse, generateDemoStream } from "./demoService.js";

// Initialize OpenAI client (works with OpenAI, Gemini-compatible, or AgentRouter endpoints)
let client = null;

const getClient = () => {
  if (client) return client;
  if (!config.openai.apiKey) {
    return null;
  }
  client = new OpenAI({
    apiKey: config.openai.apiKey,
    baseURL: config.openai.baseURL,
  });
  return client;
};

// Check if we should use demo mode (no API key, or demo flag set)
const shouldUseDemo = () => {
  return !config.openai.apiKey || process.env.USE_DEMO_AI === "true";
};

// Sleep helper for retry backoff
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Core chat completion helper with JSON mode
// Falls back to demo mode only if no API key is configured.
// If a key IS configured but the API rejects it (e.g. 401), the real error
// is thrown so the user is informed instead of receiving identical demo output.
// Transient errors (429 rate limit, 5xx) are retried with exponential backoff
// before falling back to demo mode.
export const chatCompletion = async (messages, { json = false, temperature = 0.7, maxTokens = 1500 } = {}) => {
  // Use demo mode if no API key configured or demo flag is set
  if (shouldUseDemo()) {
    console.log("🤖 [Demo Mode] Generating demo response (no valid AI API key)");
    return generateDemoResponse(messages, { json });
  }

  const openai = getClient();
  const params = {
    model: config.openai.model,
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  if (json) {
    params.response_format = { type: "json_object" };
  }

  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create(params);
      return response.choices[0].message.content;
    } catch (error) {
      const status = error.status || "unknown";
      lastError = error;
      const errMsg = (error.message || "").toLowerCase();
      console.warn(`⚠️  AI API error (${status}) [attempt ${attempt}/${maxRetries}]: ${error.message}`);

      // Authentication errors mean the configured key is invalid/expired.
      // Do NOT retry or silently fall back to demo mode — surface the error so the
      // user knows their API key needs fixing (otherwise they get identical
      // demo output every time and think the feature is broken).
      if (status === 401 || status === 403) {
        const err = new Error(
          "AI API key was rejected by the provider (401 Unauthorized). Please check that your OPENAI_API_KEY is valid and has credits."
        );
        err.status = 502;
        throw err;
      }

      // Non-retryable billing/quota errors: depleted credits, quota exhausted,
      // RESOURCE_EXHAUSTED, or insufficient quota. Retrying these is pointless
      // (they won't resolve within seconds) and just wastes time before demo fallback.
      const isBillingError =
        errMsg.includes("prepayment credits are depleted") ||
        errMsg.includes("quota") ||
        errMsg.includes("resource_exhausted") ||
        errMsg.includes("insufficient_quota") ||
        errMsg.includes("billing");

      if (isBillingError) {
        console.warn("   💳 Billing/quota error detected — not retrying. Falling back to demo mode.");
        console.warn("   To fix: add credits at your AI provider's billing dashboard, or set USE_DEMO_AI=true in backend/.env.");
        return generateDemoResponse(messages, { json });
      }

      // Retry transient errors (429 rate limit, 5xx server errors, network)
      // with exponential backoff before giving up and falling back to demo.
      const isTransient = status === 429 || status >= 500 || status === "unknown";
      if (isTransient && attempt < maxRetries) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 4000); // 1s, 2s, 4s
        console.warn(`   Retrying in ${backoffMs}ms...`);
        await sleep(backoffMs);
        continue;
      }
    }
  }

  // All retries exhausted — fall back to demo mode for this request
  console.warn("   All retries exhausted. Falling back to demo mode for this request.");
  return generateDemoResponse(messages, { json });
};

// Streaming chat completion (for AI chat feature)
// Falls back to demo streaming only if no API key is configured.
// If a key IS configured but the API rejects it (e.g. 401), the real error
// is thrown so the user is informed instead of receiving identical demo output.
export const streamChatCompletion = async (messages, { temperature = 0.7 } = {}) => {
  // Use demo mode if no API key configured or demo flag is set
  if (shouldUseDemo()) {
    console.log("🤖 [Demo Mode] Generating demo stream (no valid AI API key)");
    return generateDemoStream(messages);
  }

  const openai = getClient();

  try {
    const stream = await openai.chat.completions.create({
      model: config.openai.model,
      messages,
      temperature,
      stream: true,
    });
    return stream;
  } catch (error) {
    const status = error.status || "unknown";
    console.warn(`⚠️  AI API stream error (${status}): ${error.message}`);

    // Authentication errors mean the configured key is invalid/expired.
    // Do NOT silently fall back to demo mode — surface the error so the
    // user knows their API key needs fixing (otherwise they get identical
    // demo output every time and think the feature is broken).
    if (status === 401 || status === 403) {
      const err = new Error(
        "AI API key was rejected by the provider (401 Unauthorized). Please check that your OPENAI_API_KEY is valid and has credits."
      );
      err.status = 502;
      throw err;
    }

    // For other transient errors (429 rate limit, 500, network), fall back to demo
    console.warn("   Falling back to demo stream for this request.");
    return generateDemoStream(messages);
  }
};

// Safe JSON parse
export const safeJsonParse = (str) => {
  try {
    // Strip markdown code fences if present
    let cleaned = str.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    }
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

export default { chatCompletion, streamChatCompletion, safeJsonParse };
