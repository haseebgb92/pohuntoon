import { chooseModelDefaults, classifyModelRoles } from "@/lib/ai/model-selection";

describe("AI model selection", () => {
  it("classifies discovered models by stable role signals", () => {
    expect(classifyModelRoles({ id: "qwen-coder:latest", capabilities: ["chat", "streaming"] })).toEqual(
      expect.arrayContaining(["coding"]),
    );
    expect(classifyModelRoles({ id: "nomic-embed-text", capabilities: ["embeddings"] })).toEqual(
      expect.arrayContaining(["embeddings"]),
    );
    expect(classifyModelRoles({ id: "llava-vision", capabilities: ["chat", "vision", "streaming"] })).toEqual(
      expect.arrayContaining(["vision"]),
    );
  });

  it("chooses defaults from discovered models without hardcoding model ids", () => {
    const defaults = chooseModelDefaults([
      {
        id: "fast-chat-small",
        provider: "ollama",
        capabilities: ["chat", "streaming"],
        roles: ["fast-chat"],
      },
      {
        id: "reasoning-large",
        provider: "ollama",
        capabilities: ["chat", "streaming"],
        roles: ["reasoning", "long-context"],
        contextLength: 64000,
      },
    ]);

    expect(defaults["fast-chat"]).toBe("fast-chat-small");
    expect(defaults.reasoning).toBe("reasoning-large");
    expect(defaults["long-context"]).toBe("reasoning-large");
  });
});
