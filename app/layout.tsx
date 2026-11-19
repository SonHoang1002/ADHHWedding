import type { Metadata, Viewport } from "next";
import { Great_Vibes, Lora } from "next/font/google";
import type { ReactNode } from "react";

import "../src/index.css";
import "../src/main/WeddingInvite.css";

// next/font tự tải & self-host font, tránh việc @import Google Fonts bị Turbopack loại bỏ.
const lora = Lora({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Huy Hiếu & Ánh Dương – Thiệp cưới",
  description: "Trân trọng kính mời bạn đến dự ngày trọng đại của Huy Hiếu và Ánh Dương.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#380a0e",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${lora.variable} ${greatVibes.variable}`}>
      <body>{children}</body>
    </html>
  );
}
