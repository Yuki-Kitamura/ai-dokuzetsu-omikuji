import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { AdBanner } from "@/components/AdBanner";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI毒舌おみくじ",
  description: "絶望を予言するAIおみくじ",
};

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {googleSiteVerification && (
          <meta
            name="google-site-verification"
            content={googleSiteVerification}
          />
        )}
      </head>
      <body
        className={`${jetbrainsMono.className} bg-black text-white min-h-screen antialiased`}
      >
        {children}
        <AdBanner />
      </body>
    </html>
  );
}
