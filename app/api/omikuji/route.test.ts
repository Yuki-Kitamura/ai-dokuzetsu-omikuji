import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/openai", () => ({
  generateOmikujiText: vi.fn(),
}));

const { generateOmikujiText } = await import("@/lib/openai");

describe("POST /api/omikuji", () => {
  beforeEach(() => {
    vi.mocked(generateOmikujiText).mockReset();
  });

  it("空入力の場合は 400 を返す", async () => {
    const req = new Request("http://localhost/api/omikuji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(generateOmikujiText).not.toHaveBeenCalled();
  });

  it("input が無い場合は 400 を返す", async () => {
    const req = new Request("http://localhost/api/omikuji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(generateOmikujiText).not.toHaveBeenCalled();
  });

  it("正常な入力では 200 と result を返す", async () => {
    vi.mocked(generateOmikujiText).mockResolvedValue(
      "【ランク】凶\n【おみくじ】無理するな\n【ラッキーアイテム】お茶"
    );
    const req = new Request("http://localhost/api/omikuji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: "勉強" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(generateOmikujiText).toHaveBeenCalledWith("勉強");
    const data = await res.json();
    expect(data).toEqual({
      result:
        "【ランク】凶\n【おみくじ】無理するな\n【ラッキーアイテム】お茶",
    });
  });
});
