import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

describe("Home", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              result:
                "【ランク】大凶\n【おみくじ】今日は家で寝てな\n【ラッキーアイテム】布団",
            }),
        })
      )
    );
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("入力→ボタン押下→APIレスポンスが画面に表示される", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText(/今日何すんの/);
    await user.type(input, "仕事");

    const button = screen.getByRole("button", { name: /絶望を予言する/ });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/【ランク】大凶/)).toBeInTheDocument();
    });
    expect(screen.getByText(/【おみくじ】今日は家で寝てな/)).toBeInTheDocument();
    expect(screen.getByText(/【ラッキーアイテム】布団/)).toBeInTheDocument();
  });
});
