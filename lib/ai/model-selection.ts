import type { AiModelDefaults, AiModelInfo, AiModelRole } from "@/lib/ai/types";

const roleSignals: Record<AiModelRole, string[]> = {
  reasoning: ["reason", "deepseek", "r1", "think"],
  "fast-chat": ["mini", "small", "fast", "chat"],
  "long-context": ["long", "32k", "64k", "128k", "context"],
  coding: ["code", "coder", "qwen", "deepseek", "starcoder"],
  embeddings: ["embed", "embedding"],
  vision: ["vision", "vl", "llava", "pixtral"],
};

export function classifyModelRoles(model: Pick<AiModelInfo, "id" | "capabilities" | "contextLength">): AiModelRole[] {
  const id = model.id.toLowerCase();
  const roles = new Set<AiModelRole>();

  for (const [role, signals] of Object.entries(roleSignals) as Array<[AiModelRole, string[]]>) {
    if (signals.some((signal) => id.includes(signal))) {
      roles.add(role);
    }
  }

  if (model.capabilities.includes("embeddings")) roles.add("embeddings");
  if (model.capabilities.includes("vision")) roles.add("vision");
  if (model.contextLength && model.contextLength >= 32000) roles.add("long-context");
  if (!roles.size && model.capabilities.includes("chat")) roles.add("fast-chat");

  return [...roles];
}

export function chooseModelDefaults(models: AiModelInfo[]): AiModelDefaults {
  const defaults: AiModelDefaults = {};
  const roles: AiModelRole[] = ["reasoning", "fast-chat", "long-context", "coding", "embeddings", "vision"];

  for (const role of roles) {
    const candidates = models.filter((model) => model.roles.includes(role));
    const preferred = candidates.sort((left, right) => (right.contextLength ?? 0) - (left.contextLength ?? 0))[0];

    if (preferred) {
      defaults[role] = preferred.id;
    }
  }

  return defaults;
}
