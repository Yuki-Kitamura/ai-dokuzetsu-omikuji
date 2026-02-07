"use client";

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
        onLoad={fillAd}
      />
      <footer
        className="fixed bottom-0 left-0 right-0 flex h-16 min-h-[64px] items-center justify-center bg-[#111111]"
        aria-hidden
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: 64 }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={ADSENSE_SLOT}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </footer>
    </>
  );
}
