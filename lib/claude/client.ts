import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = join(__dirname, "../../prompts");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = "claude-sonnet-4-6";

export function loadPrompt(name: string): string {
  return readFileSync(join(PROMPTS_DIR, `${name}.md`), "utf-8");
}

export async function generateJson<T>(
  systemPrompt: string,
  userMessage: string,
  options: { maxTokens?: number; temperature?: number } = {}
): Promise<T> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: options.maxTokens ?? 4096,
    temperature: options.temperature ?? 0,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  // Extract JSON from markdown code block if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, text];
  const jsonText = (jsonMatch[1] ?? text).trim();

  return JSON.parse(jsonText) as T;
}

export async function generateText(
  systemPrompt: string,
  userMessage: string,
  options: { maxTokens?: number } = {}
): Promise<string> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: options.maxTokens ?? 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  return message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
}
