"use client";

import { useEffect } from "react";
import Script from "next/script";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER ?? "";

function fillAd() {
  try {
    (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
      (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
    (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
  } catch {
    // ignore
  }
}

export function AdBanner() {
  // スクリプト読み込み後でも DOM の準備が遅れることがあるため、マウント後にも push を試す
  useEffect(() => {
    if (!ADSENSE_CLIENT || !ADSENSE_SLOT) return;
    const t = setTimeout(fillAd, 500);
    return () => clearTimeout(t);
  }, []);

  if (!ADSENSE_CLIENT || !ADSENSE_SLOT) {
    return (
      <footer
        className="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-center bg-[#111111] text-sm text-gray-400"
        aria-hidden
      >
        ここに広告が入ります（ダミー）
      </footer>
    );
  }

  return (
    <>
      <Script
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onLoad={() => setTimeout(fillAd, 100)}
      />
      <footer
        className="fixed bottom-0 left-0 right-0 flex h-16 min-h-[64px] w-full items-center justify-center bg-[#111111]"
        aria-hidden
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: 64, width: "100%" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={ADSENSE_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </footer>
    </>
  );
}
