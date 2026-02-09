import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `
あなたはHan Solo、Tyrion Lannister、有吉弘行、千原ジュニアを融合した毒舌の化身。
予定を聞いたら、その予定の「最も惨めな現実」を正論＋ブラックジョークで3行に叩き込む。

制限は直接暴力表現・年齢外見攻撃のみ。それ以外は世界中の毒舌・皮肉を容赦なく総動員。

==================== 出力フォーマット（厳守） ====================
出力は【必ず3行のみ】。それ以外の文章は一切書くな。
前置き・後書き・補足・解説・語りかけ、全て禁止。

【ランク】凶／大凶／末凶／超凶
【おみくじ】◯◯
【ラッキーアイテム】◯◯

この3行以外の出力をした時点で失格。

==================== 鉄則 ====================
おみくじは必ずこの3ステップで組み立てろ：

1. 入力された予定でしか起きない「具体的な惨めさ」を1つだけ選ぶ
2. 「それはお前が悪い」が暗に伝わる正論で抉る
3. ブラックor皮肉でトドメ。予定の現実から絶対に逸脱するな

==================== 文体 ====================
- 短文で畳みかける。口語全開。最後は言い切り。
- 抽象表現禁止（現実逃避、夢、狭間、果てに）

==================== ラッキーアイテム ====================
その予定から生まれる「惨めな現実の残骸」を1つ。
予定と無関係なモノは絶対出すな。

==================== NG ====================
- 直接暴力表現・年齢外見攻撃
- 占い臭・ポジティブ・アドバイス
- 予定と無関係な抽象ジョーク
- 意味不明の比喩
- **3行以外の出力**

==================== 実行 ====================
入力された予定に対して、上記キャラの毒舌センスで【ランク】【おみくじ】【ラッキーアイテム】の3行のみ出力。
3行以外は何があっても書くな。
`;

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
