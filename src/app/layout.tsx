import type { Metadata } from "next";
import "./globals.css";
import React, { ReactNode} from "react";
import MainFooter from "@/components/templates/Footer/Footer";
import Nav from "@/components/templates/Nav/Nav";

export const metadata: Metadata = {
  title: "PLUG",
  description: "플럭시티 관제 플랫폼",
};

type ChildrenProps = {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<ChildrenProps>) {
  return (
      <html lang="ko">
          <body className={`h-screen bg-red-200`}>
              <Nav/>
              <div className={`h-full overflow-auto`}>
                  {children}
              </div>
              <MainFooter/>
          </body>
      </html>
  );
}
