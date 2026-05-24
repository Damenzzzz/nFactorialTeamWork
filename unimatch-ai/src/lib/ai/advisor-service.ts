import OpenAI from "openai";
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import { ADVISOR_SYSTEM_PROMPT } from "@/lib/ai/advisor-prompt";
import {
  createAdvisorToolHandlers,
  parseDegreeLevel,
  type AdvisorToolContext,
  type CalculateAdmissionChanceOutput,
  type CompareProgramsOutput,
  type ProgramRequirementsOutput,
  type SearchProgramsOutput,
} from "@/lib/ai/tools";
import type {
  AdvisorRequest,
  AdvisorResponsePayload,
  AdvisorStudentProfile,
  AdvisorToolName,
  ComparedProgram,
  Recommendation,
  SavedStudentPreferences,
} from "@/lib/domain";

interface ModelAdvisorResponse {
  answer: string;
  suggestedQuestions: string[];
}

interface AdvisorCollection {
  comparedPrograms?: ComparedProgram[];
  recommendations?: Recommendation[];
  requirements?: ProgramRequirementsOutput;
  savedPreferences?: SavedStudentPreferences;
  searchedPrograms?: SearchProgramsOutput;
}

type AdvisorToolResult =
  | SearchProgramsOutput
  | CompareProgramsOutput
  | ProgramRequirementsOutput
  | CalculateAdmissionChanceOutput
  | SavedStudentPreferences;

const advisorTools: ChatCompletionTool[] = [
  {
    function: {
      description:
        "Search known UniMatch catalog programs by field, degree level, country, budget, scholarship need, and query text.",
      name: "searchPrograms",
      parameters: {
        additionalProperties: false,
        properties: {
          countries: { items: { type: "string" }, type: "array" },
          degreeLevel: {
            enum: ["Bachelor", "Master", "PhD"],
            type: "string",
          },
          field: { type: "string" },
          limit: { maximum: 12, minimum: 1, type: "number" },
          maxTuition: { minimum: 0, type: "number" },
          query: { type: "string" },
          scholarshipRequired: { type: "boolean" },
        },
        type: "object",
      },
    },
    type: "function",
  },
  {
    function: {
      description:
        "Compare shortlisted programs by tuition, country, IELTS, GPA, scholarship availability, deadline, and profile fit.",
      name: "comparePrograms",
      parameters: {
        additionalProperties: false,
        properties: {
          programIds: { items: { type: "string" }, type: "array" },
          studentProfile: { type: "object" },
        },
        type: "object",
      },
    },
    type: "function",
  },
  {
    function: {
      description:
        "Return catalog admission requirements, documents, language tests, notes, and deadline for selected program IDs.",
      name: "getProgramRequirements",
      parameters: {
        additionalProperties: false,
        properties: {
          programId: { type: "string" },
          programIds: { items: { type: "string" }, type: "array" },
        },
        type: "object",
      },
    },
    type: "function",
  },
  {
    function: {
      description:
        "Calculate admission fit from UniMatch catalog requirements and the student profile.",
      name: "calculateAdmissionChance",
      parameters: {
        additionalProperties: false,
        properties: {
          limit: { maximum: 12, minimum: 1, type: "number" },
          programIds: { items: { type: "string" }, type: "array" },
          studentProfile: { type: "object" },
        },
        type: "object",
      },
    },
    type: "function",
  },
  {
    function: {
      description:
        "Apply student preferences to this advisor answer.",
      name: "saveStudentPreferences",
      parameters: {
        additionalProperties: false,
        properties: {
          shortlistedProgramIds: { items: { type: "string" }, type: "array" },
          studentProfile: { type: "object" },
        },
        type: "object",
      },
    },
    type: "function",
  },
];

export async function getAdvisorResponse(
  request: AdvisorRequest,
): Promise<AdvisorResponsePayload> {
  const context: AdvisorToolContext = {
    message: request.message,
    shortlistedProgramIds: request.shortlistedProgramIds ?? [],
    studentProfile: request.studentProfile,
  };

  if (!process.env.OPENAI_API_KEY) {
    return getLocalAdvisorFallback(context);
  }

  try {
    return await getOpenAIAdvisorResponse(context);
  } catch {
    return getLocalAdvisorFallback(context);
  }
}

async function getOpenAIAdvisorResponse(
  context: AdvisorToolContext,
): Promise<AdvisorResponsePayload> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const handlers = createAdvisorToolHandlers(context);
  const toolsUsed = new Set<AdvisorToolName>();
  const collection: AdvisorCollection = {};
  const messages: ChatCompletionMessageParam[] = [
    { content: ADVISOR_SYSTEM_PROMPT, role: "system" },
    {
      content: JSON.stringify({
        message: context.message,
        shortlistedProgramIds: context.shortlistedProgramIds,
        studentProfile: context.studentProfile,
      }),
      role: "user",
    },
  ];

  for (let index = 0; index < 6; index += 1) {
    const completion = await client.chat.completions.create({
      messages,
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.2,
      tool_choice: index === 0 ? "required" : "auto",
      tools: advisorTools,
    });
    const message = completion.choices[0]?.message;

    if (!message) {
      break;
    }

    messages.push(message as ChatCompletionMessageParam);

    if (message.tool_calls?.length) {
      for (const toolCall of message.tool_calls) {
        if (toolCall.type !== "function") {
          continue;
        }

        const toolName = toolCall.function.name as AdvisorToolName;
        const result = await executeToolCall(
          toolName,
          parseToolArguments(toolCall.function.arguments),
          handlers,
        );
        toolsUsed.add(toolName);
        collectToolResult(toolName, result, collection);
        messages.push({
          content: JSON.stringify(result),
          role: "tool",
          tool_call_id: toolCall.id,
        });
      }

      continue;
    }

    const parsed = parseModelAdvisorResponse(message.content);

    return {
      aiAvailable: true,
      answer: parsed.answer,
      comparedPrograms: collection.comparedPrograms,
      recommendations: collection.recommendations,
      savedPreferences: collection.savedPreferences,
      suggestedQuestions: parsed.suggestedQuestions,
      toolsUsed: Array.from(toolsUsed),
    };
  }

  return getLocalAdvisorFallback(context);
}

async function getLocalAdvisorFallback(
  context: AdvisorToolContext,
): Promise<AdvisorResponsePayload> {
  const handlers = createAdvisorToolHandlers(context);
  const toolsUsed = new Set<AdvisorToolName>();
  const savedPreferences = await handlers.saveStudentPreferences({});
  toolsUsed.add("saveStudentPreferences");

  const compared = context.shortlistedProgramIds.length
    ? await handlers.comparePrograms({})
    : undefined;

  if (compared) {
    toolsUsed.add("comparePrograms");
  }

  const chance = await handlers.calculateAdmissionChance({ limit: 5 });
  toolsUsed.add("calculateAdmissionChance");

  const search =
    chance.recommendations.length > 0
      ? undefined
      : await handlers.searchPrograms({ limit: 5 });

  if (search) {
    toolsUsed.add("searchPrograms");
  }

  const requirements =
    mentionsRequirements(context.message) && context.shortlistedProgramIds.length
      ? await handlers.getProgramRequirements({})
      : undefined;

  if (requirements) {
    toolsUsed.add("getProgramRequirements");
  }

  return {
    aiAvailable: false,
    answer: buildFallbackAnswer({
      chance,
      compared,
      requirements,
      search,
    }),
    comparedPrograms: compared?.comparedPrograms,
    recommendations: chance.recommendations.length
      ? chance.recommendations
      : undefined,
    savedPreferences,
    suggestedQuestions: buildSuggestedQuestions(Boolean(compared), chance.canCalculate),
    toolsUsed: Array.from(toolsUsed),
  };
}

async function executeToolCall(
  name: AdvisorToolName,
  args: Record<string, unknown>,
  handlers: ReturnType<typeof createAdvisorToolHandlers>,
): Promise<AdvisorToolResult> {
  switch (name) {
    case "calculateAdmissionChance":
      return handlers.calculateAdmissionChance({
        limit: optionalNumber(args.limit),
        programIds: optionalStringArray(args.programIds),
        studentProfile: normalizeAdvisorProfile(args.studentProfile),
      });
    case "comparePrograms":
      return handlers.comparePrograms({
        programIds: optionalStringArray(args.programIds),
        studentProfile: normalizeAdvisorProfile(args.studentProfile),
      });
    case "getProgramRequirements":
      return handlers.getProgramRequirements({
        programId: optionalString(args.programId),
        programIds: optionalStringArray(args.programIds),
      });
    case "saveStudentPreferences":
      return handlers.saveStudentPreferences({
        shortlistedProgramIds: optionalStringArray(args.shortlistedProgramIds),
        studentProfile: normalizeAdvisorProfile(args.studentProfile),
      });
    case "searchPrograms":
      return handlers.searchPrograms({
        countries: optionalStringArray(args.countries),
        degreeLevel:
          typeof args.degreeLevel === "string"
            ? parseDegreeLevel(args.degreeLevel)
            : undefined,
        field: optionalString(args.field),
        limit: optionalNumber(args.limit),
        maxTuition: optionalNumber(args.maxTuition),
        query: optionalString(args.query),
        scholarshipRequired: optionalBoolean(args.scholarshipRequired),
      });
  }
}

function collectToolResult(
  name: AdvisorToolName,
  result: AdvisorToolResult,
  collection: AdvisorCollection,
) {
  switch (name) {
    case "calculateAdmissionChance":
      collection.recommendations = (
        result as CalculateAdmissionChanceOutput
      ).recommendations;
      break;
    case "comparePrograms":
      collection.comparedPrograms = (result as CompareProgramsOutput).comparedPrograms;
      break;
    case "getProgramRequirements":
      collection.requirements = result as ProgramRequirementsOutput;
      break;
    case "saveStudentPreferences":
      collection.savedPreferences = result as SavedStudentPreferences;
      break;
    case "searchPrograms":
      collection.searchedPrograms = result as SearchProgramsOutput;
      break;
  }
}

function parseModelAdvisorResponse(content: string | null): ModelAdvisorResponse {
  if (!content) {
    return {
      answer:
        "I checked the UniMatch program catalog, but I need a more specific question to prepare a useful answer.",
      suggestedQuestions: buildSuggestedQuestions(false, false),
    };
  }

  try {
    const parsed = JSON.parse(content) as Partial<ModelAdvisorResponse>;
    const answer =
      typeof parsed.answer === "string" && parsed.answer.trim()
        ? parsed.answer.trim()
        : content;

    return {
      answer,
      suggestedQuestions: Array.isArray(parsed.suggestedQuestions)
        ? parsed.suggestedQuestions
            .filter((question): question is string => typeof question === "string")
            .slice(0, 3)
        : buildSuggestedQuestions(false, false),
    };
  } catch {
    return {
      answer: content,
      suggestedQuestions: buildSuggestedQuestions(false, false),
    };
  }
}

function buildFallbackAnswer({
  chance,
  compared,
  requirements,
  search,
}: {
  chance: CalculateAdmissionChanceOutput;
  compared?: CompareProgramsOutput;
  requirements?: ProgramRequirementsOutput;
  search?: SearchProgramsOutput;
}): string {
  const lead = "I used the UniMatch program catalog to prepare this answer.";
  const catalogNote =
    "This guidance is based on available program data. Always verify final requirements on official university pages.";

  if (chance.recommendations.length) {
    const top = chance.recommendations
      .slice(0, 3)
      .map(
        (recommendation, index) =>
          `${index + 1}. ${recommendation.program.name} at ${recommendation.university.name} (${recommendation.matchScore}/100)`,
      )
      .join("; ");
    const compareNote = compared?.comparedPrograms.length
      ? ` I also compared ${compared.comparedPrograms.length} shortlisted program(s).`
      : "";
    const requirementNote = requirements?.requirements.length
      ? ` Requirement details were checked for ${requirements.requirements.length} shortlisted program(s).`
      : "";

    return `${lead} ${catalogNote} Your strongest current matches are: ${top}.${compareNote}${requirementNote} Treat these scores as planning signals, not admission guarantees.`;
  }

  if (search?.programs.length) {
    const matches = search.programs
      .slice(0, 3)
      .map((record) => `${record.program.name} at ${record.university.name}`)
      .join("; ");

    return `${lead} ${catalogNote} I found programs to explore: ${matches}. For a more precise answer, calculate your admission fit first.`;
  }

  return `${lead} ${catalogNote} I need a little more profile detail to make this useful. Fill in your intended field, degree level, GPA, budget, and preferred countries, then calculate your admission fit.`;
}

function buildSuggestedQuestions(
  hasComparison: boolean,
  hasChance: boolean,
): string[] {
  if (hasComparison) {
    return [
      "Which shortlisted program has the lowest risk?",
      "What requirements should I improve first?",
      "Which option is best for scholarships?",
    ];
  }

  if (hasChance) {
    return [
      "Why is my top match ranked first?",
      "Which requirements are missing?",
      "How can I improve my admission chances?",
    ];
  }

  return [
    "Which fields and countries should I start with?",
    "What GPA and IELTS targets should I plan for?",
    "What should I add to my profile first?",
  ];
}

function parseToolArguments(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value) as unknown;
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function normalizeAdvisorProfile(value: unknown): AdvisorStudentProfile | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return {
    degreeLevel:
      typeof value.degreeLevel === "string"
        ? parseDegreeLevel(value.degreeLevel)
        : undefined,
    gpa: optionalNumber(value.gpa),
    ielts: optionalNumber(value.ielts),
    intendedField: optionalString(value.intendedField),
    maxTuition: optionalNumber(value.maxTuition),
    preferredCountries: optionalStringArray(value.preferredCountries),
    sat: optionalNumber(value.sat),
    scholarshipRequired: optionalBoolean(value.scholarshipRequired),
  };
}

function mentionsRequirements(message: string): boolean {
  const normalized = message.toLowerCase();
  return [
    "deadline",
    "document",
    "gpa",
    "ielts",
    "requirement",
    "requirements",
    "sat",
  ].some((term) => normalized.includes(term));
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function optionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return normalized.length ? normalized : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
