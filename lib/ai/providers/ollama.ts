import { chooseModelDefaults, classifyModelRoles } from "@/lib/ai/model-selection";
import type {
  AiChatRequest,
  AiChatResponse,
  AiModelCapability,
  AiModelInfo,
  AiProviderAdapter,
  AiProviderDiscovery,
} from "@/lib/ai/types";

type OllamaTagModel = {
  name?: string;
  model?: string;
  modified_at?: string;
  details?: {
    family?: string;
    families?: string[];
    parameter_size?: string;
    quantization_level?: string;
  };
  context_length?: number;
  num_ctx?: number;
};

type OllamaTagsResponse = {
  models?: OllamaTagModel[];
};

function getOllamaBaseUrl() {
  const value = process.env.OLLAMA_URL;

  if (!value) {
    throw new Error("Missing OLLAMA_URL");
  }

  return value.replace(/\/$/, "");
}

function getOllamaApiKey() {
  const value = process.env.OLLAMA_API_KEY;

  if (!value) {
    throw new Error("Missing OLLAMA_API_KEY");
  }

  return value;
}

function getModelCapabilities(model: OllamaTagModel): AiModelCapability[] {
  const id = (model.name ?? model.model ?? "").toLowerCase();
  const families = [model.details?.family, ...(model.details?.families ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const capabilities = new Set<AiModelCapability>(["chat", "streaming"]);

  if (id.includes("embed") || families.includes("bert")) {
    capabilities.add("embeddings");
    capabilities.delete("chat");
  }

  if (id.includes("vision") || id.includes("llava") || id.includes("vl") || families.includes("clip")) {
    capabilities.add("vision");
  }

  return [...capabilities];
}

function mapOllamaModel(model: OllamaTagModel): AiModelInfo | null {
  const id = model.name ?? model.model;

  if (!id) {
    return null;
  }

  const capabilities = getModelCapabilities(model);
  const mapped: AiModelInfo = {
    id,
    provider: "ollama",
    name: id,
    capabilities,
    roles: [],
    contextLength: model.context_length ?? model.num_ctx,
    raw: model,
  };

  return { ...mapped, roles: classifyModelRoles(mapped) };
}

export class OllamaProviderAdapter implements AiProviderAdapter {
  id = "ollama" as const;

  async discoverModels(): Promise<AiProviderDiscovery> {
    const response = await fetch(`${getOllamaBaseUrl()}/tags`, {
      headers: {
        Authorization: `Bearer ${getOllamaApiKey()}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to discover Ollama-compatible models.");
    }

    const payload = (await response.json()) as OllamaTagsResponse;
    const models = (payload.models ?? [])
      .map(mapOllamaModel)
      .filter((model): model is AiModelInfo => Boolean(model));
    const capabilities = [...new Set(models.flatMap((model) => model.capabilities))];

    return {
      provider: "ollama",
      models,
      defaults: chooseModelDefaults(models),
      capabilities,
    };
  }

  async chat(request: AiChatRequest): Promise<AiChatResponse> {
    const discovery = await this.discoverModels();
    const model = request.model ?? discovery.defaults.reasoning ?? discovery.defaults["fast-chat"];

    if (!model) {
      throw new Error("No chat-compatible AI model is available.");
    }

    const response = await fetch(`${getOllamaBaseUrl()}/chat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getOllamaApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: request.messages,
        stream: request.stream ?? false,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to complete AI chat request.");
    }

    const payload = (await response.json()) as { message?: { content?: string }; response?: string; model?: string };

    return {
      model: payload.model ?? model,
      content: payload.message?.content ?? payload.response ?? "",
    };
  }
}
