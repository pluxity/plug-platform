import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "탄천 악취 모니터링",
  description: "탄천의 악취를 모니터링하고 AI 로 시뮬레이션하여 예측하는 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
