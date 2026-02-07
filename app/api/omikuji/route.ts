import { NextRequest, NextResponse } from "next/server";
import { generateOmikujiText } from "@/lib/openai";

/**
 * POST /api/omikuji
 * 入力: { input: string }
 * 成功: 200, { result: string }
 * 不正入力: 400
 */
export async function POST(request: NextRequest) {
  let body: { input?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const input =
    typeof body?.input === "string" ? body.input.trim() : "";

  if (input === "") {
    return NextResponse.json(
      { error: "input is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  try {
    const result = await generateOmikujiText(input);
    return NextResponse.json({ result });
  } catch (err) {
    const status = typeof (err as { status?: number })?.status === "number" ? (err as { status: number }).status : 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    if (status === 429) {
      return NextResponse.json(
        { error: "OpenAIの利用枠に達しました。プラン・請求設定を確認してください。（429）" },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: message },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
