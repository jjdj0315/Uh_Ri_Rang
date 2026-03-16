import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DAKER - Hackathon Platform",
  description: "해커톤 플랫폼 DAKER",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
