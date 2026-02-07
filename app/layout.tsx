import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI毒舌おみくじ",
  description: "絶望を予言するAIおみくじ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${jetbrainsMono.className} bg-black text-white min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
