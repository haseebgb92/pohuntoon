const fs = require("node:fs");
const path = require("node:path");

function parseEnv(content) {
  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        const key = line.slice(0, index);
        const value = line.slice(index + 1).replace(/^"|"$/g, "");
        return [key, value];
      }),
  );
}

function classify(id, capabilities, contextLength) {
  const value = id.toLowerCase();
  const roles = new Set();
  const signals = {
    reasoning: ["reason", "deepseek", "r1", "think"],
    "fast-chat": ["mini", "small", "fast", "chat"],
    "long-context": ["long", "32k", "64k", "128k", "context"],
    coding: ["code", "coder", "qwen", "deepseek", "starcoder"],
    embeddings: ["embed", "embedding"],
    vision: ["vision", "vl", "llava", "pixtral"],
  };

  for (const [role, names] of Object.entries(signals)) {
    if (names.some((name) => value.includes(name))) roles.add(role);
  }

  if (capabilities.includes("embeddings")) roles.add("embeddings");
  if (capabilities.includes("vision")) roles.add("vision");
  if (contextLength && contextLength >= 32000) roles.add("long-context");
  if (!roles.size && capabilities.includes("chat")) roles.add("fast-chat");

  return [...roles];
}

function capabilitiesFor(model) {
  const id = String(model.name || model.model || model.id || "").toLowerCase();
  const families = [model.details?.family, ...(model.details?.families || [])].filter(Boolean).join(" ").toLowerCase();
  const capabilities = new Set(["chat", "streaming"]);

  if (id.includes("embed") || families.includes("bert")) {
    capabilities.add("embeddings");
    capabilities.delete("chat");
  }

  if (id.includes("vision") || id.includes("llava") || id.includes("vl") || families.includes("clip")) {
    capabilities.add("vision");
  }

  return [...capabilities];
}

function chooseDefaults(models) {
  const defaults = {};
  for (const role of ["reasoning", "fast-chat", "long-context", "coding", "embeddings", "vision"]) {
    const candidate = models
      .filter((model) => model.roles.includes(role))
      .sort((left, right) => (right.contextLength || 0) - (left.contextLength || 0))[0];
    if (candidate) defaults[role] = candidate.id;
  }
  return defaults;
}

async function main() {
  const env = parseEnv(fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8"));
  const baseUrl = String(env.OLLAMA_URL || "").replace(/\/$/, "");
  const apiKey = env.OLLAMA_API_KEY;

  if (!baseUrl || !apiKey) throw new Error("Missing AI provider configuration.");

  const response = await fetch(`${baseUrl}/tags`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = { raw: text.slice(0, 500) };
  }

  const returnedModels = Array.isArray(payload.models) ? payload.models : Array.isArray(payload.tags) ? payload.tags : [];
  const models = returnedModels.map((model) => {
    const id = String(model.name || model.model || model.id || model);
    const capabilities = capabilitiesFor(model);
    const contextLength = model.context_length || model.num_ctx || model.contextLength;
    return {
      id,
      provider: "ollama",
      capabilities,
      roles: classify(id, capabilities, contextLength),
      contextLength,
      modifiedAt: model.modified_at,
      details: model.details,
    };
  });

  const report = {
    provider: "ollama",
    endpoint: `${baseUrl}/tags`,
    ok: response.ok,
    status: response.status,
    modelCount: models.length,
    capabilities: [...new Set(models.flatMap((model) => model.capabilities))],
    defaults: chooseDefaults(models),
    models,
  };

  fs.writeFileSync(path.join(process.cwd(), "docs", "ai-provider-discovery.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ok: report.ok, status: report.status, modelCount: report.modelCount, report: "docs/ai-provider-discovery.json" }));

  if (!response.ok) process.exitCode = 1;
}

main().catch((error) => {
  fs.writeFileSync(path.join(process.cwd(), "docs", "ai-provider-discovery.json"), JSON.stringify({ ok: false, error: error.message }, null, 2));
  console.log(JSON.stringify({ ok: false, report: "docs/ai-provider-discovery.json" }));
  process.exitCode = 1;
});
