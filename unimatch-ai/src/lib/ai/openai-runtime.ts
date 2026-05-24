import OpenAI from "openai";

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getOpenAIModel(): string {
  return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
}

export async function generateJsonWithOpenAI<T>({
  system,
  user,
}: {
  system: string;
  user: string;
}): Promise<Partial<T> | undefined> {
  if (!isOpenAIConfigured()) {
    return undefined;
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      messages: [
        { content: system, role: "system" },
        { content: user, role: "user" },
      ],
      model: getOpenAIModel(),
      temperature: 0.1,
      tool_choice: {
        function: { name: "return_structured_result" },
        type: "function",
      },
      tools: [
        {
          function: {
            description:
              "Return the structured JSON payload requested by the system instructions.",
            name: "return_structured_result",
            parameters: {
              additionalProperties: true,
              type: "object",
            },
          },
          type: "function",
        },
      ],
    });
    const message = completion.choices[0]?.message;
    const toolCall = message?.tool_calls?.find(
      (call) => call.type === "function",
    );
    const content =
      toolCall?.type === "function"
        ? toolCall.function.arguments
        : message?.content;

    if (!content) {
      return undefined;
    }

    const parsed = JSON.parse(content) as unknown;
    return isRecord(parsed) ? (parsed as Partial<T>) : undefined;
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
