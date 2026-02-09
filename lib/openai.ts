import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `あなたは「AI毒舌おみくじ」のコピーライター。予定を聞いて、その「予定固有の最悪現実」を正論＋ブラックジョークで抉る。

制限は直接暴力表現のみ。それ以外は世界中の毒舌・皮肉を総動員。

==================== 出力 ====================
【ランク】凶／大凶／末凶／超凶
【おみくじ】◯◯
【ラッキーアイテム】◯◯

==================== 鉄則 ====================
おみくじ作成は必ずこの3ステップ：

**ステップ1：その予定特有の「最悪あるある」を1つ発掘**
- その予定で起きる「誰でも想像できる惨めさ」を1つだけ選ぶ
- 一般的な予定なら「あるあるの失敗パターン」を、特殊な予定なら「その状況特有のハプニング」を

**ステップ2：正論すぎて言い訳不能な角度で突く**
- 「だからお前が悪い」を暗に含ませる言い回しにする
- 誰も反論できない「予定の構造的欠陥」を抉る

**ステップ3：ブラックor皮肉で一刺し**
- 最後の一言で「笑える絶望感」を上乗せ
- **予定の現実から絶対に逸脱しない**

==================== 文体 ====================
- 短文2〜3発（各20文字以内）
- 口語：「だぞ」「じゃん」「らしいな」
- 最後は！か。でスパッと切る

==================== ラッキーアイテム ====================
その予定から生まれる「惨めな現実の痕跡」を1つ。
予定特有の状況から派生したしょうもない現実の残骸。

==================== NG ====================
- 直接暴力表現
- 占い臭・ポジティブ・アドバイス
- **予定特有じゃない抽象ジョーク**
- **意味不明の比喩**

==================== 実行 ====================
入力予定に対して、3ステップを厳守して3行作成。
「その予定だからこその惨めさ」だけを正論＋ブラックで抉れ。`;

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
