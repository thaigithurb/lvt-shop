import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "LVT Shop",
  description: "Cửa hàng online tiện dụng nhất thế giới",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Header />
          <main>
            {children}
          </main>
        <Footer />
      </body>
    </html>
  );
}
