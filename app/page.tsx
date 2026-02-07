"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";

const WARNING_LINE = "⚠️ダークユーモア注意！気にしないでね！";
const CACHE_KEY_PREFIX = "omikuji:";

function getCacheKey(input: string): string {
  return CACHE_KEY_PREFIX + input.trim().toLowerCase();
}

const CONFIRM_MESSAGE = "過激な表現を含むが問題ないか";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const doGenerate = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setError(null);
    setResult(null);

    const cacheKey = getCacheKey(trimmed);
    const cached =
      typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;
    if (cached) {
      setResult(cached);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/omikuji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.error ?? "エラーが発生しました";
        const isQuotaError = res.status === 503 || /quota|429|利用枠/.test(String(msg));
        if (isQuotaError) {
          setError("OpenAIの利用枠に達しています。プラン・請求設定を確認してください。");
        } else {
          setError(msg);
        }
        return;
      }
      setResult(data.result);
      if (typeof window !== "undefined") {
        localStorage.setItem(cacheKey, data.result);
      }
    } catch {
      setError("通信エラーです");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setShowConfirm(true);
  };

  const handleConfirmOk = () => {
    setShowConfirm(false);
    doGenerate();
  };

  const handleSaveImage = async () => {
    const el = resultRef.current;
    if (!el) return;
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: "#000000",
        pixelRatio: 2,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "omikuji.png";
      a.click();
    } catch {
      setError("画像の保存に失敗しました");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-8 pb-24">
        <h1 className="mb-8 text-2xl font-bold">AI毒舌おみくじ</h1>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, 50))}
          placeholder="今日何すんの？（どうせ失敗だろ）"
          maxLength={50}
          className="mb-4 w-full max-w-md rounded border border-gray-600 bg-black px-4 py-2 text-white placeholder-gray-500 focus:border-white focus:outline-none"
          disabled={loading}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded bg-white px-6 py-2 text-black hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? "予言中…" : "絶望を予言する"}
        </button>

        {showConfirm && (
          <div
            className="fixed inset-0 z-10 flex items-center justify-center bg-black/80 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <div className="w-full max-w-sm rounded border border-gray-600 bg-black p-6">
              <p id="confirm-title" className="mb-6 text-center">
                {CONFIRM_MESSAGE}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="rounded border border-gray-600 px-4 py-2 hover:bg-gray-800"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOk}
                  className="rounded bg-white px-4 py-2 text-black hover:bg-gray-200"
                >
                  問題ない
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-400" role="alert">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-8 w-full max-w-md">
            <div
              ref={resultRef}
              className="rounded border border-gray-700 bg-black p-4 text-sm leading-relaxed"
            >
              <p>{WARNING_LINE}</p>
              <pre className="mt-2 whitespace-pre-wrap font-sans">
                {result}
              </pre>
            </div>
            <button
              type="button"
              onClick={handleSaveImage}
              className="mt-4 rounded border border-gray-600 px-4 py-2 text-sm hover:bg-gray-900"
            >
              画像を保存
            </button>
          </div>
        )}
      </main>

      <footer
        className="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-center bg-[#111111] text-sm text-gray-400"
        aria-hidden
      >
        ここに広告が入ります（ダミー）
      </footer>
    </div>
  );
}
