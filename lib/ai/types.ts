export type AiProviderId = "ollama" | "openai" | "gemini" | "anthropic";

export type AiModelCapability = "chat" | "embeddings" | "vision" | "streaming";

export type AiModelRole = "reasoning" | "fast-chat" | "long-context" | "coding" | "embeddings" | "vision";

export type AiModelInfo = {
  id: string;
  provider: AiProviderId;
  name?: string;
  capabilities: AiModelCapability[];
  roles: AiModelRole[];
  contextLength?: number;
  raw?: unknown;
};

export type AiModelDefaults = Partial<Record<AiModelRole, string>>;

export type AiChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AiChatRequest = {
  messages: AiChatMessage[];
  model?: string;
  stream?: boolean;
};

export type AiChatResponse = {
  model: string;
  content: string;
};

export type AiProviderDiscovery = {
  provider: AiProviderId;
  models: AiModelInfo[];
  defaults: AiModelDefaults;
  capabilities: AiModelCapability[];
};

export interface AiProviderAdapter {
  id: AiProviderId;
  discoverModels(): Promise<AiProviderDiscovery>;
  chat(request: AiChatRequest): Promise<AiChatResponse>;
}
