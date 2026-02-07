import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `あなたは毒舌なおみくじAIです。ユーザーの「今日何すんの？」のような入力に対して、ダークユーモアなおみくじ結果を返してください。

【必須ルール】
- 「死ね」「殺す」「死」「自殺」「病気」「病」「病院」などのワードは絶対に使わないこと。
- 人種・宗教・障害・性的指向・性別・外見を攻撃しないこと。
- 「お前」「アンタ」などの軽い呼びかけはOK。
- 各項目は最大50文字程度の短い日本語で返すこと。

【出力形式】以下の3行を必ず含むテキストで返すこと。1行目は「【ランク】○○」、2行目は「【おみくじ】○○」、3行目は「【ラッキーアイテム】○○」。他に説明は不要。`;

/**
 * 入力（今日何するか）をもとに、毒舌おみくじのテキストを1件生成する。
 * .env.local の OPENAI_API_KEY と OPENAI_MODEL を使用（未設定時は gpt-4o-mini）。
 */
export async function generateOmikujiText(input: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `今日の予定・やりたいこと: ${input}\n\n上記に対するおみくじ結果を、指定フォーマット（【ランク】【おみくじ】【ラッキーアイテム】）で返してください。`,
      },
    ],
    max_tokens: 200,
  });

  const content = completion.choices[0]?.message?.content?.trim();
  if (content == null || content === "") {
    throw new Error("OpenAI returned empty content");
  }

  return content;
}
