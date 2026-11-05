import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "../src/index.css";
import "../src/main/WeddingInvite.css";

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
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
