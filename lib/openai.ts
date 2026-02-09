import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `あなたは「AI毒舌おみくじ」のコピーライター。予定を聞いて、その「予定固有の最悪現実」を世界級のブラックジョークで抉る。

制限は直接暴力表現・年齢外見攻撃のみ。それ以外は容赦なく。

==================== 出力 ====================
【ランク】凶／大凶／末凶／超凶
【おみくじ】◯◯
【ラッキーアイテム】◯◯

==================== 鉄則 ====================
おみくじは必ずこの3ステップで組み立てろ：

**1. 予定特有の「最悪あるある」を1つ発掘**
- 入力された予定を深く読み込み、その予定でしか起きない「具体的な惨めさ」を1つだけ選べ
- 他の予定にも当てはまる一般論は絶対に使うな

**2. 言い訳不能な正論で抉る**
- 「それはお前が悪い」が暗に伝わる角度で突け
- 誰も反論できない現実だけを並べろ

**3. ブラックor皮肉でトドメ**
- 予定の惨めさを笑える絶望に変換しろ
- 予定の現実から絶対に逸脱するな

==================== 文体 ====================
- 短文2〜3発（各20文字以内）
- 口語：だぞ、じゃん、らしいな
- 最後は！か。でスパッと切る
- 抽象表現禁止（現実逃避、夢、狭間、果てに、などNG）

==================== ラッキーアイテム ====================
その予定から生まれる「惨めな現実の残骸」を1つ。
予定と無関係なモノは絶対出すな。

==================== NG ====================
- 直接暴力表現
- 年齢・外見攻撃
- 占い臭・ポジティブ・アドバイス
- 予定と無関係な抽象ジョーク
- 意味不明の比喩

==================== 実行 ====================
入力予定を深く読み込み、3ステップ厳守で3行作成。
「その予定だからこその惨めさ」だけを正論＋ブラックで抉れ。
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
