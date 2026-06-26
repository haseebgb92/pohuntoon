import type { AiChatRequest, AiChatResponse, AiProviderAdapter, AiProviderDiscovery } from "@/lib/ai/types";
import { OllamaProviderAdapter } from "@/lib/ai/providers/ollama";

function createDefaultProvider(): AiProviderAdapter {
  return new OllamaProviderAdapter();
}

export class AiService {
  constructor(private readonly provider: AiProviderAdapter = createDefaultProvider()) {}

  discoverModels(): Promise<AiProviderDiscovery> {
    return this.provider.discoverModels();
  }

  chat(request: AiChatRequest): Promise<AiChatResponse> {
    return this.provider.chat(request);
  }
}

export const aiService = new AiService();
