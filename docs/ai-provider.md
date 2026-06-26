# AI Provider

Pohuntoon now has an AI provider foundation. Application features must call `AiService` instead of calling provider APIs directly.

## Architecture

```text
Application
-> AI Service (`lib/ai/service.ts`)
-> Provider Adapter (`lib/ai/providers/*`)
-> External AI provider
```

## Current Provider

The active adapter is Ollama-compatible and uses server-only environment variables:

- `OLLAMA_URL`
- `OLLAMA_API_KEY`

Model discovery uses:

```text
GET {OLLAMA_URL}/tags
Authorization: Bearer OLLAMA_API_KEY
```

Secrets must not be logged, rendered, committed, or exposed through `NEXT_PUBLIC_*` variables.

## Live Discovery

Discovery succeeded against the configured Ollama-compatible provider on 2026-06-26. The redacted machine-readable report is stored at `docs/ai-provider-discovery.json`.

Returned model IDs:

- `nemotron-3-super`
- `nemotron-3-ultra`
- `deepseek-v3.2`
- `gpt-oss:120b`
- `gpt-oss:20b`
- `minimax-m2.5`
- `ministral-3:14b`
- `mistral-large-3:675b`
- `devstral-small-2:24b`
- `kimi-k2.7-code`
- `rnj-1:8b`
- `nemotron-3-nano:30b`
- `minimax-m3`
- `gemma3:4b`
- `gemma3:12b`
- `qwen3-coder:480b`
- `deepseek-v4-flash`
- `deepseek-v3.1:671b`
- `ministral-3:3b`
- `devstral-2:123b`
- `gemma3:27b`
- `gemma4:31b`
- `glm-4.7`
- `glm-5.2`
- `kimi-k2.6`
- `qwen3.5:397b`
- `glm-5`
- `qwen3-coder-next`
- `deepseek-v4-pro`
- `minimax-m2.7`
- `gemini-3-flash-preview`
- `glm-5.1`
- `minimax-m2.1`
- `ministral-3:8b`
- `kimi-k2.5`

## Chosen Defaults

Defaults are selected only from returned models:

- Reasoning: `deepseek-v3.2`
- Fast chat: `nemotron-3-super`
- Coding: `deepseek-v3.2`
- Long context: not reported by provider metadata
- Embeddings: not reported by provider metadata
- Vision: not reported by provider metadata

## Capabilities

The `/tags` response confirms chat-capable models and supports streaming by Ollama-compatible API convention. The response did not include embedding models, vision-specific models, or context length metadata.

## Model Roles

The model selection layer can classify discovered models into:

- reasoning
- fast chat
- long context
- coding
- embeddings
- vision

Defaults are selected from returned models only. If no model is returned for a role, that role remains unset.

## Future Provider Strategy

Future adapters should implement `AiProviderAdapter` from `lib/ai/types.ts`:

- Ollama
- OpenAI
- Gemini
- Anthropic

Application code should continue to depend only on `AiService` and shared AI types.
