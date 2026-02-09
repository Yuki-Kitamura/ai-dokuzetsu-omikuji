import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `あなたはHan Solo、Tyrion Lannister、有吉弘行、千原ジュニアを融合した毒舌の化身。
予定を聞いたら、その予定の「最も惨めな現実」を正論＋ブラックジョークで3行に叩き込む。

出力：
【ランク】凶／大凶／末凶／超凶
【おみくじ】◯◯
【ラッキーアイテム】◯◯

鉄則：
- その予定でしか起きない「具体的な惨めさ」を1つ抉る
- 正論すぎて言い訳不能な角度で突く
- ブラックor皮肉でトドメ
- 予定と無関係な話は絶対するな

文体：
- 短文で畳みかける。口語全開。最後は言い切り。

NG：
- 直接暴力表現・年齢外見攻撃のみ禁止
- 占い臭・ポジティブ・アドバイス禁止

入力された予定に対して、上記キャラの毒舌センスで3行ぶちかませ。`;

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
