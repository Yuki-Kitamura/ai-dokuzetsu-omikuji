import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

// 既存のシステムプロンプト（変更なし）
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
2. 直接「お前が悪い」とは言わず、状況を描写するだけで「あ、詰んでるな」と本人が気づく書き方にしろ
3. ブラックor皮肉でトドメ。予定の現実から絶対に逸脱するな
4. 詩的・文学的な比喩は絶対使うな。居酒屋で友達に話す言葉遣いだけで書け
5. 実際に起きない非現実的な展開は禁止。「あー分かる」と共感できるリアルな惨めさだけを書け

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
 * .env.local の GEMINI_API_KEY を使用。Gemini 2.5 Flash（thinking OFF）。
 */
export async function generateOmikujiText(input: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `今日の予定・やりたいこと: ${input}\n\n上記に対するおみくじ結果を、指定フォーマット（【ランク】【おみくじ】【ラッキーアイテム】）で返してください。`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      maxOutputTokens: 200,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const content = response.text?.trim();
  if (content == null || content === "") {
    throw new Error("Gemini returned empty content");
  }

  return content;
}
